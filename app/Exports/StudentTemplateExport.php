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

        // Add dropdown validation for Agama (column D) - rows 3 to 100
        $agamaValidation = $sheet->getCell('D3')->getDataValidation();
        $agamaValidation->setType(\PhpOffice\PhpSpreadsheet\Cell\DataValidation::TYPE_LIST);
        $agamaValidation->setErrorStyle(\PhpOffice\PhpSpreadsheet\Cell\DataValidation::STYLE_INFORMATION);
        $agamaValidation->setAllowBlank(false);
        $agamaValidation->setShowInputMessage(true);
        $agamaValidation->setShowErrorMessage(true);
        $agamaValidation->setShowDropDown(true);
        $agamaValidation->setErrorTitle('Input Error');
        $agamaValidation->setError('Pilih agama dari daftar yang tersedia.');
        $agamaValidation->setPromptTitle('Pilih Agama');
        $agamaValidation->setPrompt('Pilih salah satu: Islam, Kristen, Katolik, Hindu, Buddha, Konghucu');
        $agamaValidation->setFormula1('"Islam,Kristen,Katolik,Hindu,Buddha,Konghucu"');
        
        // Apply to rows 3-100
        for ($row = 3; $row <= 100; $row++) {
            $sheet->getCell("D{$row}")->setDataValidation(clone $agamaValidation);
        }

        // Add dropdown validation for Jenis Kelamin (column E) - rows 3 to 100
        $genderValidation = $sheet->getCell('E3')->getDataValidation();
        $genderValidation->setType(\PhpOffice\PhpSpreadsheet\Cell\DataValidation::TYPE_LIST);
        $genderValidation->setErrorStyle(\PhpOffice\PhpSpreadsheet\Cell\DataValidation::STYLE_INFORMATION);
        $genderValidation->setAllowBlank(false);
        $genderValidation->setShowInputMessage(true);
        $genderValidation->setShowErrorMessage(true);
        $genderValidation->setShowDropDown(true);
        $genderValidation->setErrorTitle('Input Error');
        $genderValidation->setError('Pilih L (Laki-laki) atau P (Perempuan).');
        $genderValidation->setPromptTitle('Pilih Jenis Kelamin');
        $genderValidation->setPrompt('L = Laki-laki, P = Perempuan');
        $genderValidation->setFormula1('"L,P"');
        
        // Apply to rows 3-100
        for ($row = 3; $row <= 100; $row++) {
            $sheet->getCell("E{$row}")->setDataValidation(clone $genderValidation);
        }

        // Format Tanggal Lahir column (F) as Date and add validation
        $sheet->getStyle('F:F')->getNumberFormat()
            ->setFormatCode(\PhpOffice\PhpSpreadsheet\Style\NumberFormat::FORMAT_DATE_YYYYMMDD2);
        
        // Add date validation for Tanggal Lahir (column F) - rows 3 to 100
        $dateValidation = $sheet->getCell('F3')->getDataValidation();
        $dateValidation->setType(\PhpOffice\PhpSpreadsheet\Cell\DataValidation::TYPE_DATE);
        $dateValidation->setErrorStyle(\PhpOffice\PhpSpreadsheet\Cell\DataValidation::STYLE_INFORMATION);
        $dateValidation->setAllowBlank(true); // Tanggal lahir opsional
        $dateValidation->setShowInputMessage(true);
        $dateValidation->setShowErrorMessage(true);
        $dateValidation->setErrorTitle('Format Tanggal Salah');
        $dateValidation->setError('Masukkan tanggal yang valid. Contoh: 2010-05-15');
        $dateValidation->setPromptTitle('Tanggal Lahir');
        $dateValidation->setPrompt('Ketik tanggal lahir. Format akan otomatis dikonversi.');
        // Date range from 1990 to 2020 (reasonable birth year range for students)
        $dateValidation->setFormula1('DATE(1990,1,1)');
        $dateValidation->setFormula2('DATE(2020,12,31)');
        $dateValidation->setOperator(\PhpOffice\PhpSpreadsheet\Cell\DataValidation::OPERATOR_BETWEEN);
        
        // Apply to rows 3-100
        for ($row = 3; $row <= 100; $row++) {
            $sheet->getCell("F{$row}")->setDataValidation(clone $dateValidation);
        }

        // Add instructions comment to header
        $sheet->getComment('A1')->getText()->createTextRun(
            "INSTRUKSI PENGISIAN:\n\n" .
            "1. Nama Lengkap: WAJIB diisi (username akan otomatis dibuat dari nama)\n" .
            "2. NIS: WAJIB diisi, harus unik\n" .
            "3. NISN: Opsional, jika diisi harus unik\n" .
            "4. Agama: WAJIB diisi (pilih dari dropdown)\n" .
            "5. Jenis Kelamin: WAJIB diisi (pilih dari dropdown: L/P)\n" .
            "6. Tanggal Lahir: Opsional (ketik tanggal, format otomatis dikonversi)\n" .
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
