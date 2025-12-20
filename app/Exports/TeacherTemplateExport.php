<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Alignment;

class TeacherTemplateExport implements FromArray, WithHeadings, WithStyles, WithColumnWidths
{
    /**
     * Define the headings for the Excel template.
     */
    public function headings(): array
    {
        return [
            'Nama Lengkap',
            'Email',
            'NIP',
            'No. Telepon',
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
                'INSTRUKSI: Isi data guru mulai dari baris ke-4. Username akan otomatis dibuat dari Nama Lengkap. Hapus baris ini sebelum import.',
            ],
            [],
            // Sample data
            [
                'Budi Santoso',
                'budi.santoso@sekolah.com',
                '198501012010011001', // NIP 18 digit
                '081234567890',
                'Jl. Merdeka No. 123, Jakarta',
            ],
            [
                'Siti Nurhaliza',
                'siti.nurhaliza@sekolah.com',
                '199002152012012001', // NIP 18 digit
                '082345678901',
                'Jl. Sudirman No. 456, Bandung',
            ],
        ];
    }

    /**
     * Apply styles to the Excel sheet.
     */
    public function styles(Worksheet $sheet)
    {
        // Style header row
        $sheet->getStyle('A1:E1')->applyFromArray([
            'font' => [
                'bold' => true,
                'color' => ['rgb' => 'FFFFFF'],
                'size' => 12,
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => '70AD47'],
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
        ]);

        // Format NIP column (C) as TEXT to prevent scientific notation
        $sheet->getStyle('C:C')->getNumberFormat()
            ->setFormatCode(\PhpOffice\PhpSpreadsheet\Style\NumberFormat::FORMAT_TEXT);

        // Style sample data rows
        $sheet->getStyle('A3:E5')->applyFromArray([
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
            "2. Email: WAJIB diisi, harus unik (tidak boleh duplikat)\n" .
            "3. NIP: Opsional, jika diisi harus unik (18 digit, format sebagai TEXT)\n" .
            "4. No. Telepon: Opsional\n" .
            "5. Alamat: Opsional\n\n" .
            "CATATAN:\n" .
            "- Username akan otomatis dibuat dari Nama Lengkap (format: nama.lengkap)\n" .
            "- Kolom NIP sudah diformat sebagai TEXT untuk mencegah format scientific (E+17)\n" .
            "- Baris 2 kosong, baris 3 dan 4 adalah contoh data\n" .
            "- Password default untuk semua guru: 'password'\n" .
            "- Guru harus mengganti password setelah login pertama kali"
        );

        return $sheet;
    }

    /**
     * Define column widths.
     */
    public function columnWidths(): array
    {
        return [
            'A' => 30, // Nama Lengkap
            'B' => 35, // Email
            'C' => 25, // NIP
            'D' => 18, // No. Telepon
            'E' => 40, // Alamat
        ];
    }
}
