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
            'Email',
            'NIS',
            'NISN',
            'Agama',
            'Jenis Kelamin',
            'Tanggal Lahir',
            'Alamat',
            'ID Kelas',
            'Status Aktif',
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
                'INSTRUKSI: Isi data siswa mulai dari baris ke-4. Username akan otomatis dibuat dari Nama Lengkap. Hapus baris ini sebelum import.',
            ],
            [],
            // Sample data with pre-filled class ID
            [
                'Ahmad Fauzi',
                'ahmad.fauzi@sekolah.com',
                '2023001',
                '0051234567',
                'Islam',
                'L',
                '2010-05-15',
                'Jl. Kenanga No. 10, Jakarta',
                $this->classId ?? '1', // Pre-filled class ID
                'Ya',
            ],
            [
                'Siti Aminah',
                'siti.aminah@sekolah.com',
                '2023002',
                '0051234568',
                'Islam',
                'P',
                '2010-08-22',
                'Jl. Melati No. 25, Bogor',
                $this->classId ?? '1', // Pre-filled class ID
                'Ya',
            ],
        ];
    }

    /**
     * Apply styles to the Excel sheet.
     */
    public function styles(Worksheet $sheet)
    {
        // Style header row
        $sheet->getStyle('A1:J1')->applyFromArray([
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

        // Format NIS (C) and NISN (D) columns as TEXT to prevent scientific notation
        $sheet->getStyle('C:C')->getNumberFormat()
            ->setFormatCode(\PhpOffice\PhpSpreadsheet\Style\NumberFormat::FORMAT_TEXT);
        $sheet->getStyle('D:D')->getNumberFormat()
            ->setFormatCode(\PhpOffice\PhpSpreadsheet\Style\NumberFormat::FORMAT_TEXT);

        // Style sample data rows
        $sheet->getStyle('A3:J5')->applyFromArray([
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
            "2. Email: WAJIB diisi, harus unik\n" .
            "3. NIS: WAJIB diisi, harus unik\n" .
            "4. NISN: Opsional, jika diisi harus unik\n" .
            "5. Agama: WAJIB diisi (Islam/Kristen/Katolik/Hindu/Buddha/Konghucu)\n" .
            "6. Jenis Kelamin: WAJIB diisi (L untuk Laki-laki, P untuk Perempuan)\n" .
            "7. Tanggal Lahir: Opsional (format: YYYY-MM-DD, contoh: 2010-05-15)\n" .
            "8. Alamat: Opsional\n" .
            "9. ID Kelas: Opsional (harus ID kelas yang valid)\n" .
            "10. Status Aktif: WAJIB diisi (Ya/Tidak)\n\n" .
            "CATATAN:\n" .
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
            'B' => 30, // Email
            'C' => 15, // NIS
            'D' => 15, // NISN
            'E' => 15, // Agama
            'F' => 18, // Jenis Kelamin
            'G' => 18, // Tanggal Lahir
            'H' => 35, // Alamat
            'I' => 12, // ID Kelas
            'J' => 15, // Status Aktif
        ];
    }
}
