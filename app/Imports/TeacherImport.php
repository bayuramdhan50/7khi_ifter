<?php

namespace App\Imports;

use App\Models\User;
use App\Models\Teacher;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\SkipsFailures;
use Maatwebsite\Excel\Concerns\WithStartRow;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;

class TeacherImport implements ToModel, WithHeadingRow, WithValidation, SkipsOnFailure, WithStartRow, SkipsEmptyRows
{
    use SkipsFailures;

    protected $importedCount = 0;
    protected $errors = [];

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
            $sampleNames = ['Budi Santoso', 'Siti Nurhaliza'];
            if (in_array($name, $sampleNames)) {
                return null;
            }

            DB::beginTransaction();

            // Generate username from name
            $username = $this->generateUsername($name);

            // Generate default password: firstname + current day
            $defaultPassword = $this->generateDefaultPassword($name);

            // Create user account
            $user = User::create([
                'name' => $name,
                'username' => $username,
                'password' => Hash::make($defaultPassword),
                'plain_password' => $defaultPassword, // Store plain password for admin view
                'role' => User::ROLE_GURU,
            ]);

            // Create teacher record (cast numeric fields to string)
            $teacher = Teacher::create([
                'user_id' => $user->id,
                'nip' => !empty($row['nip']) ? (string) $row['nip'] : null,
                'phone' => !empty($row['no_telepon']) ? (string) $row['no_telepon'] : null,
                'address' => !empty($row['alamat']) ? $row['alamat'] : null,
                'is_active' => true,
            ]);

            DB::commit();
            $this->importedCount++;

            return $teacher;
        } catch (\Exception $e) {
            DB::rollBack();
            $this->errors[] = $e->getMessage();
            throw $e;
        }
    }

    /**
     * Generate default password from first name + current day.
     * Example: "Budi Santoso" created on 29th => "budi29"
     */
    private function generateDefaultPassword($name): string
    {
        // Get first name (first word) and convert to lowercase
        $nameParts = explode(' ', trim($name));
        $firstName = strtolower($nameParts[0]);
        
        // Remove special characters from first name
        $firstName = preg_replace('/[^a-z]/', '', $firstName);
        
        // Get current day (2 digits)
        $day = now()->format('d');
        
        // Combine: firstname + day
        $password = $firstName . $day;
        
        return strlen($password) >= 3 ? $password : 'password123';
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
            'nip' => [
                'nullable',
                'unique:teachers,nip',
            ],
            'no_telepon' => [
                'nullable',
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
            'nip.unique' => 'NIP sudah terdaftar',
            'no_telepon.max' => 'No. telepon maksimal 20 karakter',
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

    /**
     * Define starting row for import (skip header row 1 and instruction row 2).
     * Data starts from row 3.
     */
    public function startRow(): int
    {
        return 3;
    }

    /**
     * Define which row contains the headings.
     */
    public function headingRow(): int
    {
        return 1;
    }
}
