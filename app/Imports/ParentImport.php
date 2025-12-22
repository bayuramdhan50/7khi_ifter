<?php

namespace App\Imports;

use App\Models\User;
use App\Models\ParentModel;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\SkipsFailures;

class ParentImport implements ToModel, WithHeadingRow, WithValidation, SkipsOnFailure
{
    use SkipsFailures;

    private $importedCount = 0;
    private $errors = [];
    private $classId;

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
            $sampleNames = ['Budi Hartono', 'Siti Rahayu'];
            if (in_array($name, $sampleNames)) {
                return null;
            }

            DB::beginTransaction();

            // Create user account
            $user = User::create([
                'name' => $name,
                'username' => $row['username'],
                'password' => Hash::make('password123'),
                'role' => User::ROLE_ORANGTUA,
            ]);

            // Create parent record (cast phone to string)
            $parent = ParentModel::create([
                'user_id' => $user->id,
                'class_id' => $this->classId, // Set class_id from import context
                'phone' => !empty($row['no_telepon']) ? (string) $row['no_telepon'] : null,
                'address' => !empty($row['alamat']) ? $row['alamat'] : null,
                'occupation' => !empty($row['pekerjaan']) ? $row['pekerjaan'] : null,
            ]);

            DB::commit();
            $this->importedCount++;

            return $parent;
        } catch (\Exception $e) {
            DB::rollBack();
            $this->errors[] = $e->getMessage();
            throw $e;
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
            'username' => [
                'required',
                'string',
                'max:50',
                'unique:users,username',
            ],
            'no_telepon' => [
                'nullable',
            ],
            'alamat' => [
                'nullable',
                'string',
            ],
            'pekerjaan' => [
                'nullable',
                'string',
                'max:100',
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
            'username.required' => 'Username wajib diisi',
            'username.unique' => 'Username sudah terdaftar',
            'no_telepon.max' => 'No. telepon maksimal 20 karakter',
            'pekerjaan.max' => 'Pekerjaan maksimal 100 karakter',
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
