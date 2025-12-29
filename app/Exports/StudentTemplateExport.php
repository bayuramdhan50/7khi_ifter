<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Color;
use PhpOffice\PhpSpreadsheet\Style\Alignment;

class StudentTemplateExport implements FromArray, WithHeadings, WithStyles, WithColumnWidths
{
    protected $classId;
    protected $className;

    public function __construct($classId = null, $className = null)
    {
        $this->classId = $classId;
        $this->className = $className;
    }
    /**
     * Define the headings for the Excel template.
     */
    public function headings(): array
    {
        return [
            'Nama Lengkap',
            'NIS',
            'NISN',
            'Agama',
            'Jenis Kelamin',
            'Tanggal Lahir',
            'Alamat',
        ];
    }

    /**
     * Array data for template.
     */
    public function array(): array
    {
        return [
            // Instructions row
            [
                'INSTRUKSI: Isi data siswa mulai dari baris ke-3. Username akan otomatis dibuat dari Nama Lengkap. Hapus baris ini sebelum import.',
            ],
            [],
            // Sample data
            [
                'Ahmad Fauzi',
                '2023001',
                '0051234567',
                'Islam',
                'L',
                '2010-05-15',
                'Jl. Kenanga No. 10, Jakarta',
            ],
            [
                'Siti Aminah',
                '2023002',
                '0051234568',
                'Islam',
                'P',
                '2010-08-22',
                'Jl. Melati No. 25, Bogor',
            ],
        ];
    }

    /**
     * Apply styles to the Excel sheet.
     */
    public function styles(Worksheet $sheet)
    {
        // Style header row (A to G, 7 columns)
        $sheet->getStyle('A1:G1')->applyFromArray([
            'font' => [
                'bold' => true,
                'color' => ['rgb' => 'FFFFFF'],
                'size' => 12,
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => '4472C4'],
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
        ]);

        // Format NIS (B) and NISN (C) columns as TEXT to prevent scientific notation
        $sheet->getStyle('B:B')->getNumberFormat()
            ->setFormatCode(\PhpOffice\PhpSpreadsheet\Style\NumberFormat::FORMAT_TEXT);
        $sheet->getStyle('C:C')->getNumberFormat()
            ->setFormatCode(\PhpOffice\PhpSpreadsheet\Style\NumberFormat::FORMAT_TEXT);

        // Style sample data rows (A to G)
        $sheet->getStyle('A3:G5')->applyFromArray([
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => 'E7E6E6'],
            ],
            'font' => [
                'italic' => true,
                'color' => ['rgb' => '666666'],
            ],
        ]);

        // Add instructions comment to header
        $sheet->getComment('A1')->getText()->createTextRun(
            "INSTRUKSI PENGISIAN:\n\n" .
            "1. Nama Lengkap: WAJIB diisi (username akan otomatis dibuat dari nama)\n" .
            "2. NIS: WAJIB diisi, harus unik\n" .
            "3. NISN: Opsional, jika diisi harus unik\n" .
            "4. Agama: WAJIB diisi (Islam/Kristen/Katolik/Hindu/Buddha/Konghucu)\n" .
            "5. Jenis Kelamin: WAJIB diisi (L untuk Laki-laki, P untuk Perempuan)\n" .
            "6. Tanggal Lahir: Opsional (format: YYYY-MM-DD, contoh: 2010-05-15)\n" .
            "7. Alamat: Opsional\n\n" .
            "CATATAN:\n" .
            "- ID Kelas dan Status Aktif akan diisi otomatis oleh sistem\n" .
            "- Username akan otomatis dibuat dari Nama Lengkap (format: nama.lengkap)\n" .
            "- Baris 2 kosong, baris 3 dan 4 adalah contoh data\n" .
            "- Password default untuk semua siswa: 'password'\n" .
            "- Siswa harus mengganti password setelah login pertama kali"
        );

        return $sheet;
    }

    /**
     * Define column widths.
     */
    public function columnWidths(): array
    {
        return [
            'A' => 25, // Nama Lengkap
            'B' => 15, // NIS
            'C' => 15, // NISN
            'D' => 15, // Agama
            'E' => 18, // Jenis Kelamin
            'F' => 18, // Tanggal Lahir
            'G' => 35, // Alamat
        ];
    }
}
