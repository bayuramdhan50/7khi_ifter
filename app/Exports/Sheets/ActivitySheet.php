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

class ActivitySheet implements FromArray, WithTitle, WithStyles, WithColumnWidths
{
    protected $activity;
    protected $classId;
    protected $className;
    protected $startDate;
    protected $endDate;

    public function __construct(Activity $activity, $classId, $className, $startDate, $endDate)
    {
        $this->activity = $activity;
        $this->classId = $classId;
        $this->className = $className;
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }

    public function title(): string
    {
        return substr($this->activity->title, 0, 31); // Excel sheet name limit
    }

    public function array(): array
    {
        $students = Student::where('class_id', $this->classId)
            ->with(['user', 'activitySubmissions' => function ($query) {
                $query->where('activity_id', $this->activity->id)
                      ->whereBetween('date', [$this->startDate, $this->endDate])
                      ->with([
                          'bangunPagiDetail',
                          'berolahragaDetail',
                          'beribadahDetail',
                          'gemarBelajarDetail',
                          'makanSehatDetail',
                          'bermasyarakatDetail',
                          'tidurCepatDetail'
                      ])
                      ->orderBy('date');
            }])
            ->get();

        $data = [];
        
        // Header
        $data[] = [strtoupper($this->activity->title)];
        $data[] = ['Kelas:', $this->className];
        $data[] = ['Periode:', $this->startDate->format('d M Y') . ' - ' . $this->endDate->format('d M Y')];
        $data[] = [];
        
        // Column headers
        $headers = ['No', 'Nama', 'NIS', 'Tanggal', 'Waktu', 'Status'];
        
        // Add activity-specific headers
        $detailHeaders = $this->getActivityDetailHeaders();
        $headers = array_merge($headers, $detailHeaders);
        $headers[] = 'Foto';
        $headers[] = 'Catatan';
        
        $data[] = $headers;
        
        // Data rows
        $no = 1;
        foreach ($students as $student) {
            foreach ($student->activitySubmissions as $submission) {
                $row = [
                    $no++,
                    $student->user->name,
                    $student->nis,
                    $submission->date->format('d M Y'),
                    $submission->time ?? '-',
                    $this->getStatusText($submission->status),
                ];
                
                // Add activity-specific details
                $details = $this->getActivityDetails($submission);
                $row = array_merge($row, $details);
                
                $row[] = $submission->photo ? 'Ya' : 'Tidak';
                $row[] = $submission->notes ?? '-';
                
                $data[] = $row;
            }
        }
        
        if ($no === 1) {
            $data[] = ['Tidak ada data untuk periode ini'];
        }
        
        return $data;
    }

    private function getActivityDetailHeaders(): array
    {
        switch ($this->activity->title) {
            case 'Bangun Pagi':
                return ['Jam Bangun', 'Membereskan Tempat Tidur', 'Mandi', 'Berpakaian Rapi', 'Sarapan'];
            
            case 'Berolahraga':
                return ['Berolahraga', 'Waktu Berolahraga', 'Jenis Olahraga'];
            
            case 'Beribadah':
                return ['Subuh', 'Dzuhur', 'Ashar', 'Maghrib', 'Isya', 'Mengaji', 'Berdoa', 'Bersedekah', 'Doa Pagi', 'Baca Firman', 'Renungan', 'Doa Malam', 'Ibadah Bersama'];
            
            case 'Gemar Belajar':
                return ['Gemar Belajar', 'Ekstrakurikuler', 'Bimbingan Belajar', 'Mengerjakan Tugas'];
            
            case 'Makan Sehat':
                return ['Karbohidrat', 'Protein', 'Sayur', 'Buah'];
            
            case 'Bermasyarakat':
                return ['TARKA', 'Kerja Bakti', 'Gotong Royong'];
            
            case 'Tidur Cepat':
                return ['Jam Tidur'];
            
            default:
                return [];
        }
    }

    private function getActivityDetails($submission): array
    {
        switch ($this->activity->title) {
            case 'Bangun Pagi':
                $detail = $submission->bangunPagiDetail;
                return [
                    $detail->jam_bangun ?? '-',
                    $this->formatBoolean($detail->membereskan_tempat_tidur ?? null),
                    $this->formatBoolean($detail->mandi ?? null),
                    $this->formatBoolean($detail->berpakaian_rapi ?? null),
                    $this->formatBoolean($detail->sarapan ?? null),
                ];
            
            case 'Berolahraga':
                $detail = $submission->berolahragaDetail;
                return [
                    $this->formatBoolean($detail->berolahraga ?? null),
                    $detail->waktu_berolahraga ?? '-',
                    $detail->exercise_type ?? '-',
                ];
            
            case 'Beribadah':
                $detail = $submission->beribadahDetail;
                return [
                    $this->formatBoolean($detail->subuh ?? null),
                    $this->formatBoolean($detail->dzuhur ?? null),
                    $this->formatBoolean($detail->ashar ?? null),
                    $this->formatBoolean($detail->maghrib ?? null),
                    $this->formatBoolean($detail->isya ?? null),
                    $this->formatBoolean($detail->mengaji ?? null),
                    $this->formatBoolean($detail->berdoa ?? null),
                    $this->formatBoolean($detail->bersedekah ?? null),
                    $this->formatBoolean($detail->doa_pagi ?? null),
                    $this->formatBoolean($detail->baca_firman ?? null),
                    $this->formatBoolean($detail->renungan ?? null),
                    $this->formatBoolean($detail->doa_malam ?? null),
                    $this->formatBoolean($detail->ibadah_bersama ?? null),
                ];
            
            case 'Gemar Belajar':
                $detail = $submission->gemarBelajarDetail;
                return [
                    $this->formatBoolean($detail->gemar_belajar ?? null),
                    $this->formatBoolean($detail->ekstrakurikuler ?? null),
                    $this->formatBoolean($detail->bimbingan_belajar ?? null),
                    $this->formatBoolean($detail->mengerjakan_tugas ?? null),
                ];
            
            case 'Makan Sehat':
                $detail = $submission->makanSehatDetail;
                return [
                    $detail->karbohidrat ?? '-',
                    $detail->protein ?? '-',
                    $detail->sayur ?? '-',
                    $detail->buah ?? '-',
                ];
            
            case 'Bermasyarakat':
                $detail = $submission->bermasyarakatDetail;
                return [
                    $this->formatBoolean($detail->tarka ?? null),
                    $this->formatBoolean($detail->kerja_bakti ?? null),
                    $this->formatBoolean($detail->gotong_royong ?? null),
                ];
            
            case 'Tidur Cepat':
                $detail = $submission->tidurCepatDetail;
                return [
                    $detail->sleep_time ?? '-',
                ];
            
            default:
                return [];
        }
    }

    private function formatBoolean($value): string
    {
        if ($value === null) return '-';
        return $value ? '✓' : '✗';
    }

    private function getStatusText($status): string
    {
        return match($status) {
            'approved' => 'Disetujui',
            'rejected' => 'Ditolak',
            'pending' => 'Pending',
            default => '-',
        };
    }

    public function styles(Worksheet $sheet)
    {
        // Title row
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
        
        $lastColumn = $sheet->getHighestColumn();
        $sheet->mergeCells("A1:{$lastColumn}1");
        $sheet->getRowDimension(1)->setRowHeight(30);
        
        // Column header row
        $headerRow = 4;
        $sheet->getStyle("A{$headerRow}:{$lastColumn}{$headerRow}")->applyFromArray([
            'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF'], 'size' => 11],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => '4472C4'],
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
        ]);
        
        // Set header row height
        $sheet->getRowDimension($headerRow)->setRowHeight(25);
        
        // Freeze panes
        $sheet->freezePane('A6');
        
        // Add borders
        $lastRow = $sheet->getHighestRow();
        if ($lastRow > 5) {
            $sheet->getStyle("A5:{$lastColumn}{$lastRow}")->applyFromArray([
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => Border::BORDER_THIN,
                        'color' => ['rgb' => 'CCCCCC'],
                    ],
                ],
            ]);
        }
        
        return $sheet;
    }

    public function columnWidths(): array
    {
        $widths = [
            'A' => 6,   // No
            'B' => 25,  // Nama
            'C' => 15,  // NIS
            'D' => 15,  // Tanggal
            'E' => 12,  // Waktu
            'F' => 15,  // Status
        ];
        
        // Dynamic widths for activity-specific columns
        $detailCount = count($this->getActivityDetailHeaders());
        for ($i = 0; $i < $detailCount; $i++) {
            $column = chr(71 + $i); // Start from G
            $widths[$column] = 18;
        }
        
        // Last two columns (Foto, Catatan)
        $lastDetailColumn = chr(71 + $detailCount - 1);
        $widths[chr(ord($lastDetailColumn) + 1)] = 10; // Foto
        $widths[chr(ord($lastDetailColumn) + 2)] = 30; // Catatan
        
        return $widths;
    }
}
