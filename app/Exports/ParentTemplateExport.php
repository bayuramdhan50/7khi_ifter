<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Alignment;

class ParentTemplateExport implements FromArray, WithHeadings, WithStyles, WithColumnWidths
{
    /**
     * Define the headings for the Excel template.
     */
    public function headings(): array
    {
        return [
            'Nama Lengkap',
            'Username',
            'No. Telepon',
            'Alamat',
            'Pekerjaan',
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
                'INSTRUKSI: Isi data orang tua mulai dari baris ke-4. Orang tua akan muncul di kelas ini dan bisa dihubungkan dengan siswa lewat Edit. Hapus baris ini sebelum import.',
            ],
            [],
            // Sample data
            [
                'Budi Hartono',
                'budi.hartono',
                '081234567890',
                'Jl. Melati No. 10, Jakarta',
                'Wiraswasta',
            ],
            [
                'Siti Rahayu',
                'siti.rahayu',
                '082345678901',
                'Jl. Mawar No. 15, Bogor',
                'Ibu Rumah Tangga',
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
                'startColor' => ['rgb' => 'FFC000'],
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
        ]);

        // Format No. Telepon column (C) as TEXT to prevent formatting issues
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
            "1. Nama Lengkap: WAJIB diisi\n" .
            "2. Username: WAJIB diisi, harus unik (tidak boleh duplikat)\n" .
            "3. No. Telepon: Opsional (format sebagai TEXT untuk menjaga angka 0 di depan)\n" .
            "4. Alamat: Opsional\n" .
            "5. Pekerjaan: Opsional\n\n" .
            "CATATAN:\n" .
            "- Orang tua akan otomatis masuk ke kelas tempat import dilakukan\n" .
            "- Hubungkan orang tua dengan siswa melalui tombol Edit setelah import\n" .
            "- Kolom No. Telepon sudah diformat sebagai TEXT\n" .
            "- Baris 2 kosong, baris 3 dan 4 adalah contoh data\n" .
            "- Password default untuk semua orang tua: 'password123'\n" .
            "- Orang tua harus mengganti password setelah login pertama kali"
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
            'B' => 20, // Username
            'C' => 18, // No. Telepon
            'D' => 40, // Alamat
            'E' => 25, // Pekerjaan
        ];
    }
}
