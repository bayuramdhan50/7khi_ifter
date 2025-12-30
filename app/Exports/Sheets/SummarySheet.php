<?php

namespace App\Exports\Sheets;

use App\Models\Student;
use App\Models\Activity;
use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;

class SummarySheet implements FromArray, WithTitle, WithStyles, WithColumnWidths
{
    protected $classId;
    protected $className;
    protected $startDate;
    protected $endDate;

    public function __construct($classId, $className, $startDate, $endDate)
    {
        $this->classId = $classId;
        $this->className = $className;
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }

    public function title(): string
    {
        return 'Ringkasan';
    }

    public function array(): array
    {
        $students = Student::where('class_id', $this->classId)
            ->with(['user', 'activitySubmissions' => function ($query) {
                $query->whereBetween('date', [$this->startDate, $this->endDate])
                      ->with('activity');
            }])
            ->get();

        $activities = Activity::orderBy('order')->get();
        
        $data = [];
        
        // Header
        $data[] = ['RINGKASAN AKTIVITAS SISWA'];
        $data[] = ['Kelas:', $this->className];
        $data[] = ['Periode:', $this->startDate->format('d M Y') . ' - ' . $this->endDate->format('d M Y')];
        $data[] = [];
        
        // Statistics
        $data[] = ['STATISTIK'];
        $data[] = ['Total Siswa:', $students->count()];
        $data[] = ['Total Hari:', $this->startDate->diffInDays($this->endDate) + 1];
        $data[] = [];
        
        // Activity completion statistics
        $data[] = ['STATISTIK PER AKTIVITAS'];
        $data[] = ['Aktivitas', 'Total Pengumpulan', 'Rata-rata per Siswa'];
        
        foreach ($activities as $activity) {
            $totalSubmissions = 0;
            foreach ($students as $student) {
                $totalSubmissions += $student->activitySubmissions
                    ->where('activity_id', $activity->id)
                    ->count();
            }
            $avgPerStudent = $students->count() > 0 ? round($totalSubmissions / $students->count(), 2) : 0;
            
            $data[] = [
                $activity->title,
                $totalSubmissions,
                $avgPerStudent
            ];
        }
        
        $data[] = [];
        $data[] = ['DETAIL SISWA'];
        $data[] = ['No', 'Nama', 'NIS', 'Total Pengumpulan', 'Persentase Kehadiran'];
        
        $no = 1;
        $totalDays = $this->startDate->diffInDays($this->endDate) + 1;
        $expectedSubmissions = $totalDays * $activities->count();
        
        foreach ($students as $student) {
            $totalSubmissions = $student->activitySubmissions->count();
            $percentage = $expectedSubmissions > 0 ? round(($totalSubmissions / $expectedSubmissions) * 100, 2) : 0;
            
            $data[] = [
                $no++,
                $student->user->name,
                $student->nis,
                $totalSubmissions,
                $percentage . '%'
            ];
        }
        
        return $data;
    }

    public function styles(Worksheet $sheet)
    {
        // Title
        $sheet->getStyle('A1:E1')->applyFromArray([
            'font' => [
                'bold' => true,
                'size' => 16,
                'color' => ['rgb' => 'FFFFFF'],
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => '2E5090'],
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
        ]);
        
        $sheet->mergeCells('A1:E1');
        $sheet->getRowDimension(1)->setRowHeight(30);
        
        // Headers for sections
        $this->styleHeader($sheet, 'A5:E5'); // STATISTIK header
        // Row 8 = Aktivitas, Total Pengumpulan, Rata-rata per Siswa header (BLUE)
        // Row 9 onwards = actual activity data (NO BLUE)
        $this->styleHeader($sheet, 'A8:C8');
        
        // Dynamic header for student details
        $studentHeaderRow = $this->findRow($sheet, 'DETAIL SISWA');
        if ($studentHeaderRow > 0) {
            $this->styleHeader($sheet, "A{$studentHeaderRow}:E{$studentHeaderRow}");
            $headerRow = $studentHeaderRow + 1;
            $this->styleHeader($sheet, "A{$headerRow}:E{$headerRow}");
        }
        
        // Add borders to all cells with data
        $lastRow = $sheet->getHighestRow();
        $sheet->getStyle("A1:E{$lastRow}")->applyFromArray([
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['rgb' => 'CCCCCC'],
                ],
            ],
        ]);
        
        return $sheet;
    }

    private function styleHeader($sheet, $range)
    {
        $sheet->getStyle($range)->applyFromArray([
            'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => '4472C4'],
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
        ]);
    }

    private function findRow($sheet, $text)
    {
        $highestRow = $sheet->getHighestRow();
        for ($row = 1; $row <= $highestRow; $row++) {
            if ($sheet->getCell("A{$row}")->getValue() === $text) {
                return $row;
            }
        }
        return 0;
    }

    public function columnWidths(): array
    {
        return [
            'A' => 8,
            'B' => 30,
            'C' => 18,
            'D' => 22,
            'E' => 25,
        ];
    }
}
