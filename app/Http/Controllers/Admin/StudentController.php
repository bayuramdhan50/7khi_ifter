<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\User;
use App\Models\ClassModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

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
     * Import students from file.
     */
    public function import(Request $request)
    {
        $validated = $request->validate([
            'class_id' => 'required|exists:classes,id',
            'students' => 'required|array',
            'students.*.name' => 'required|string|max:255',
            'students.*.religion' => 'required|string|in:Islam,Kristen,Katolik,Hindu,Buddha,Konghucu',
            'students.*.gender' => 'required|string|in:L,P',
        ]);

        $imported = 0;
        $errors = [];

        foreach ($validated['students'] as $index => $studentData) {
            try {
                // Generate email from name
                $email = $this->generateEmailFromName($studentData['name']);

                // Create user account
                $user = User::create([
                    'name' => $studentData['name'],
                    'email' => $email,
                    'username' => $email,
                    'password' => Hash::make('password'),
                    'role' => User::ROLE_SISWA,
                    'religion' => $studentData['religion'],
                ]);

                // Create student record
                Student::create([
                    'user_id' => $user->id,
                    'class_id' => $validated['class_id'],
                    'gender' => $studentData['gender'],
                ]);

                $imported++;
            } catch (\Exception $e) {
                $errors[] = "Baris " . ($index + 1) . ": " . $e->getMessage();
            }
        }

        return response()->json([
            'success' => true,
            'message' => "$imported siswa berhasil diimport",
            'imported' => $imported,
            'errors' => $errors,
        ]);
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
}
