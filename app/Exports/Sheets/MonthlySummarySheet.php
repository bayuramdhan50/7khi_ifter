<?php

namespace App\Exports\Sheets;

use App\Models\Activity;
use App\Models\Student;
use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;

class MonthlySummarySheet implements FromArray, WithTitle, WithStyles, WithColumnWidths
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
        return 'Ringkasan Bulanan';
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
        $data[] = ['RINGKASAN BULANAN AKTIVITAS SISWA'];
        $data[] = ['Kelas:', $this->className];
        $data[] = ['Periode:', $this->startDate->format('d M Y') . ' - ' . $this->endDate->format('d M Y')];
        $data[] = [];
        
        // Column headers
        $headers = ['No', 'Nama', 'NIS'];
        foreach ($activities as $activity) {
            $headers[] = $activity->title;
        }
        $headers[] = 'Total';
        $headers[] = 'Persentase';
        
        $data[] = $headers;
        
        // Data rows
        $no = 1;
        $totalDays = $this->startDate->diffInDays($this->endDate) + 1;
        $expectedPerActivity = $totalDays;
        $expectedTotal = $totalDays * $activities->count();
        
        foreach ($students as $student) {
            $row = [
                $no++,
                $student->user->name,
                $student->nis,
            ];
            
            $totalSubmissions = 0;
            foreach ($activities as $activity) {
                $count = $student->activitySubmissions
                    ->where('activity_id', $activity->id)
                    ->count();
                $row[] = $count;
                $totalSubmissions += $count;
            }
            
            $row[] = $totalSubmissions;
            $percentage = $expectedTotal > 0 ? round(($totalSubmissions / $expectedTotal) * 100, 1) : 0;
            $row[] = $percentage . '%';
            
            $data[] = $row;
        }
        
        // Summary row
        $data[] = [];
        $summaryRow = ['', 'TOTAL', ''];
        foreach ($activities as $activity) {
            $total = 0;
            foreach ($students as $student) {
                $total += $student->activitySubmissions
                    ->where('activity_id', $activity->id)
                    ->count();
            }
            $summaryRow[] = $total;
        }
        
        $grandTotal = 0;
        foreach ($students as $student) {
            $grandTotal += $student->activitySubmissions->count();
        }
        $summaryRow[] = $grandTotal;
        
        $avgPercentage = $students->count() > 0 && $expectedTotal > 0 
            ? round(($grandTotal / ($expectedTotal * $students->count())) * 100, 1) 
            : 0;
        $summaryRow[] = $avgPercentage . '%';
        
        $data[] = $summaryRow;
        
        return $data;
    }

    public function styles(Worksheet $sheet)
    {
        // Title row
        $lastColumn = $sheet->getHighestColumn();
        $sheet->getStyle('A1')->applyFromArray([
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
        
        $sheet->mergeCells("A1:{$lastColumn}1");
        $sheet->getRowDimension(1)->setRowHeight(30);
        
        // Column header row
        $headerRow = 5;
        $sheet->getStyle("A{$headerRow}:{$lastColumn}{$headerRow}")->applyFromArray([
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
        
        // Summary row
        $lastRow = $sheet->getHighestRow();
        $sheet->getStyle("A{$lastRow}:{$lastColumn}{$lastRow}")->applyFromArray([
            'font' => ['bold' => true],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => 'E7E6E6'],
            ],
        ]);
        
        // Freeze panes
        $sheet->freezePane('D6');
        
        // Add borders
        $sheet->getStyle("A5:{$lastColumn}{$lastRow}")->applyFromArray([
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['rgb' => 'CCCCCC'],
                ],
            ],
        ]);
        
        return $sheet;
    }

    public function columnWidths(): array
    {
        return [
            'A' => 6,   // No
            'B' => 30,  // Nama
            'C' => 15,  // NIS
            'D' => 15,  // Activity columns...
            'E' => 15,
            'F' => 15,
            'G' => 15,
            'H' => 15,
            'I' => 15,
            'J' => 15,
            'K' => 12,  // Total
            'L' => 15,  // Persentase
        ];
    }
}
