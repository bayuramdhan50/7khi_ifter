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

class TeacherImport implements ToModel, WithHeadingRow, WithValidation, SkipsOnFailure
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
            DB::beginTransaction();

            // Generate username from name
            $username = $this->generateUsername($row['nama_lengkap']);

            // Create user account
            $user = User::create([
                'name' => $row['nama_lengkap'],
                'email' => $row['email'],
                'username' => $username,
                'password' => Hash::make('password'),
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
            'email' => [
                'required',
                'email',
                'unique:users,email',
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
            'email.required' => 'Email wajib diisi',
            'email.email' => 'Format email tidak valid',
            'email.unique' => 'Email sudah terdaftar',
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
}
