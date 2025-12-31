<?php

namespace App\Imports;

use App\Models\User;
use App\Models\Student;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\SkipsFailures;
use Illuminate\Validation\Rule;

class StudentImport implements ToModel, WithHeadingRow, WithValidation, SkipsOnFailure
{
    use SkipsFailures;

    protected $importedCount = 0;
    protected $errors = [];
    protected $classId;  // Class ID from context

    public function __construct($classId = null)
    {
        $this->classId = $classId;
    }

    /**
     * Map each row to a model.
     */
    public function model(array $row)
    {
        try {
            // Skip instruction rows and sample data rows
            $name = trim($row['nama_lengkap'] ?? '');

            // Skip if name is empty or starts with "INSTRUKSI"
            if (empty($name) || stripos($name, 'INSTRUKSI') !== false) {
                return null;
            }

            // Skip sample data rows (common sample names)
            $sampleNames = ['Ahmad Fauzi', 'Siti Aminah'];
            if (in_array($name, $sampleNames)) {
                return null;
            }

            DB::beginTransaction();

            // Generate username from name
            $username = $this->generateUsername($name);

            // Generate default password: firstname + day of birth
            $dateOfBirth = $this->parseDate($row['tanggal_lahir'] ?? null);
            $defaultPassword = $this->generateDefaultPassword($name, $dateOfBirth);

            // Create user account
            $user = User::create([
                'name' => $name,
                'username' => $username,
                'password' => Hash::make($defaultPassword),
                'plain_password' => $defaultPassword, // Store plain password for admin view
                'role' => User::ROLE_SISWA,
                'religion' => $row['agama'],
            ]);

            // Create student record (use classId from context, is_active always true)
            $student = Student::create([
                'user_id' => $user->id,
                'class_id' => $this->classId,  // Auto-filled from context
                'nis' => (string) $row['nis'],
                'nisn' => !empty($row['nisn']) ? (string) $row['nisn'] : null,
                'gender' => $row['jenis_kelamin'],
                'date_of_birth' => $this->parseDate($row['tanggal_lahir'] ?? null),
                'address' => !empty($row['alamat']) ? $row['alamat'] : null,
                'is_active' => true,  // Always active for new imports
            ]);

            DB::commit();
            $this->importedCount++;

            return $student;
        } catch (\Exception $e) {
            DB::rollBack();
            $this->errors[] = $e->getMessage();
            throw $e;
        }
    }

    /**
     * Generate unique username from name.
     */
    private function generateUsername($name)
    {
        // Convert to lowercase and replace spaces with dots
        $baseUsername = strtolower(str_replace(' ', '.', $name));

        // Remove special characters except dots
        $baseUsername = preg_replace('/[^a-z0-9.]/', '', $baseUsername);

        $username = $baseUsername;
        $counter = 1;

        // Check if username exists, add number if needed
        while (User::where('username', $username)->exists()) {
            $username = $baseUsername . $counter;
            $counter++;
        }

        return $username;
    }

    /**
     * Generate default password from first name + day of birth.
     * Example: "Ahmad Fauzi" + "2010-05-15" => "ahmad15"
     */
    private function generateDefaultPassword($name, $dateOfBirth): string
    {
        // Get first name (first word) and convert to lowercase
        $nameParts = explode(' ', trim($name));
        $firstName = strtolower($nameParts[0]);
        
        // Remove special characters from first name
        $firstName = preg_replace('/[^a-z]/', '', $firstName);
        
        // Get day from date of birth
        $day = '';
        if ($dateOfBirth) {
            try {
                $day = \Carbon\Carbon::parse($dateOfBirth)->format('d');
            } catch (\Exception $e) {
                $day = '';
            }
        }
        
        // Combine: firstname + day (fallback to 'password123' if no valid data)
        $password = $firstName . $day;
        
        return !empty($password) && strlen($password) >= 3 ? $password : 'password123';
    }

    /**
     * Parse is_active value from Excel (Ya/Tidak to boolean).
     */
    private function parseIsActive($value): bool
    {
        if (is_bool($value)) {
            return $value;
        }

        $normalized = strtolower(trim($value));
        return in_array($normalized, ['ya', 'yes', '1', 'true', 'aktif']);
    }

    /**
     * Parse date from Excel (dd/mm/yyyy or yyyy-mm-dd) to yyyy-mm-dd format.
     */
    private function parseDate($value): ?string
    {
        if (empty($value)) {
            return null;
        }

        // If already in yyyy-mm-dd format
        if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $value)) {
            return $value;
        }

        // If in dd/mm/yyyy format
        if (preg_match('/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/', $value, $matches)) {
            $day = str_pad($matches[1], 2, '0', STR_PAD_LEFT);
            $month = str_pad($matches[2], 2, '0', STR_PAD_LEFT);
            $year = $matches[3];
            return "$year-$month-$day";
        }

        // If Excel serial number (numeric)
        if (is_numeric($value)) {
            try {
                $unix_date = ($value - 25569) * 86400;
                return gmdate('Y-m-d', $unix_date);
            } catch (\Exception $e) {
                return null;
            }
        }

        // Try parsing with Carbon as fallback
        try {
            return \Carbon\Carbon::parse($value)->format('Y-m-d');
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Define validation rules for each row.
     */
    public function rules(): array
    {
        return [
            'nama_lengkap' => [
                'required',
                'string',
                'max:255',
            ],
            'nis' => [
                'required',
                'unique:students,nis',
            ],
            'nisn' => [
                'nullable',
                'unique:students,nisn',
            ],
            'agama' => [
                'required',
                'in:Islam,Kristen,Katolik,Hindu,Buddha,Konghucu',
            ],
            'jenis_kelamin' => [
                'required',
                'in:L,P',
            ],
            'tanggal_lahir' => [
                'nullable',
                // No strict validation - parseDate() handles all formats
            ],
            'alamat' => [
                'nullable',
                'string',
            ],
        ];
    }

    /**
     * Custom validation messages.
     */
    public function customValidationMessages(): array
    {
        return [
            'nama_lengkap.required' => 'Nama lengkap wajib diisi',
            'nis.required' => 'NIS wajib diisi',
            'nis.unique' => 'NIS sudah terdaftar',
            'nisn.unique' => 'NISN sudah terdaftar',
            'agama.required' => 'Agama wajib diisi',
            'agama.in' => 'Agama harus salah satu dari: Islam, Kristen, Katolik, Hindu, Buddha, Konghucu',
            'jenis_kelamin.required' => 'Jenis kelamin wajib diisi',
            'jenis_kelamin.in' => 'Jenis kelamin harus L (Laki-laki) atau P (Perempuan)',
            'tanggal_lahir.date' => 'Format tanggal lahir tidak valid (gunakan format YYYY-MM-DD)',
        ];
    }

    /**
     * Get the count of imported rows.
     */
    public function getImportedCount(): int
    {
        return $this->importedCount;
    }

    /**
     * Get errors that occurred during import.
     */
    public function getErrors(): array
    {
        return $this->errors;
    }
}
