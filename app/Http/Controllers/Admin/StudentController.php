<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\User;
use App\Models\ClassModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\StudentTemplateExport;
use App\Imports\StudentImport;
use Illuminate\Support\Facades\Validator;

class StudentController extends Controller
{
    /**
     * Store a newly created student.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'class_id' => 'nullable|exists:classes,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'nis' => 'required|string|unique:students,nis',
            'nisn' => 'nullable|string|unique:students,nisn',
            'religion' => 'required|string|in:Islam,Kristen,Katolik,Hindu,Buddha,Konghucu',
            'gender' => 'required|string|in:L,P',
            'date_of_birth' => 'nullable|date',
            'address' => 'nullable|string',
        ]);

        // Create user account
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'username' => $validated['email'],
            'password' => Hash::make('password'), // Default password
            'role' => User::ROLE_SISWA,
            'religion' => $validated['religion'],
        ]);

        // Create student record
        $student = Student::create([
            'user_id' => $user->id,
            'class_id' => $validated['class_id'] ?? null,
            'nis' => $validated['nis'],
            'nisn' => $validated['nisn'] ?? null,
            'gender' => $validated['gender'],
            'date_of_birth' => $validated['date_of_birth'] ?? null,
            'address' => $validated['address'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Siswa berhasil ditambahkan',
            'student' => [
                'id' => $student->id,
                'name' => $user->name,
                'email' => $user->email,
                'nis' => $student->nis,
                'religion' => $user->religion,
                'gender' => $student->gender,
            ],
        ]);
    }

    /**
     * Assign student to a class.
     */
    public function assignClass(Request $request, Student $student)
    {
        $validated = $request->validate([
            'class_id' => 'required|exists:classes,id',
        ]);

        $student->update([
            'class_id' => $validated['class_id'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Siswa berhasil ditambahkan ke kelas',
            'student' => [
                'id' => $student->id,
                'name' => $student->user->name,
                'class_id' => $student->class_id,
            ],
        ]);
    }

    /**
     * Update the specified student.
     */
    public function update(Request $request, Student $student)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('users', 'email')->ignore($student->user_id)],
            'nis' => ['required', 'string', Rule::unique('students', 'nis')->ignore($student->id)],
            'nisn' => ['nullable', 'string', Rule::unique('students', 'nisn')->ignore($student->id)],
            'religion' => 'required|string|in:Islam,Kristen,Katolik,Hindu,Buddha,Konghucu',
            'gender' => 'required|string|in:L,P',
            'date_of_birth' => 'nullable|date',
            'address' => 'nullable|string',
        ]);

        // Update user account
        $student->user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'religion' => $validated['religion'],
        ]);

        // Update student record
        $student->update([
            'nis' => $validated['nis'],
            'nisn' => $validated['nisn'] ?? $student->nisn,
            'gender' => $validated['gender'],
            'date_of_birth' => $validated['date_of_birth'] ?? $student->date_of_birth,
            'address' => $validated['address'] ?? $student->address,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Data siswa berhasil diupdate',
            'student' => [
                'id' => $student->id,
                'name' => $student->user->name,
                'email' => $student->user->email,
                'nis' => $student->nis,
                'religion' => $student->user->religion,
                'gender' => $student->gender,
            ],
        ]);
    }

    /**
     * Remove the specified student.
     */
    public function destroy(Student $student)
    {
        // Store user for deletion
        $user = $student->user;

        // Delete student record
        $student->delete();

        // Delete user account
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Siswa berhasil dihapus',
        ]);
    }

    /**
     * Download Excel template for student import.
     */
    public function downloadTemplate(Request $request)
    {
        $classId = $request->query('class_id');
        $className = $request->query('class_name', 'Siswa');

        // Clean class name for filename (remove spaces and special chars)
        $cleanClassName = str_replace([' ', 'Kelas '], '', $className);
        $filename = 'template_data_siswa_kelas_' . $cleanClassName . '.xlsx';

        return Excel::download(new StudentTemplateExport($classId, $className), $filename);
    }

    /**
     * Import students from Excel file.
     */
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls|max:5120', // Max 5MB
        ]);

        try {
            $import = new StudentImport();
            Excel::import($import, $request->file('file'));

            $imported = $import->getImportedCount();
            $errors = collect($import->failures())->map(function ($failure) {
                return [
                    'row' => $failure->row(),
                    'attribute' => $failure->attribute(),
                    'errors' => $failure->errors(),
                    'values' => $failure->values(),
                ];
            })->toArray();

            if (count($errors) > 0) {
                return response()->json([
                    'success' => false,
                    'message' => "Import selesai dengan beberapa error. $imported siswa berhasil diimport.",
                    'imported' => $imported,
                    'errors' => $errors,
                ], 422);
            }

            return response()->json([
                'success' => true,
                'message' => "$imported siswa berhasil diimport",
                'imported' => $imported,
            ]);
        } catch (\Maatwebsite\Excel\Validators\ValidationException $e) {
            $failures = $e->failures();
            $errors = [];

            foreach ($failures as $failure) {
                $errors[] = [
                    'row' => $failure->row(),
                    'attribute' => $failure->attribute(),
                    'errors' => $failure->errors(),
                ];
            }

            return response()->json([
                'success' => false,
                'message' => 'Terdapat error validasi pada file Excel',
                'errors' => $errors,
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Terjadi kesalahan saat import: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Generate email from name.
     */
    private function generateEmailFromName($name)
    {
        $baseEmail = strtolower(str_replace(' ', '.', $name)) . '@ifter.com';
        $email = $baseEmail;
        $counter = 1;

        // Check if email exists, add number if needed
        while (User::where('email', $email)->exists()) {
            $email = strtolower(str_replace(' ', '.', $name)) . $counter . '@ifter.com';
            $counter++;
        }

        return $email;
    }

    /**
     * Export student activity data for a class.
     */
    public function exportActivities(Request $request)
    {
        $classId = $request->query('class_id');
        $className = $request->query('class_name', 'Kelas');
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');

        // Clean class name for filename
        $cleanClassName = str_replace([' ', 'Kelas '], '', $className);
        
        // Generate filename with date
        $dateStr = \Carbon\Carbon::now()->format('Ymd');
        $filename = 'Aktivitas_Siswa_' . $cleanClassName . '_' . $dateStr . '.xlsx';

        return Excel::download(
            new \App\Exports\StudentActivityExport($classId, $className, $startDate, $endDate),
            $filename
        );
    }
}
