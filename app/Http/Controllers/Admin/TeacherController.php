<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\TeacherTemplateExport;
use App\Imports\TeacherImport;

class TeacherController extends Controller
{
    /**
     * Store a newly created teacher.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'nip' => 'nullable|string|max:20|unique:teachers,nip',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'class_id' => 'nullable|exists:classes,id',
        ]);

        DB::beginTransaction();
        try {
            // Create user
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => User::ROLE_GURU,
            ]);

            // Create teacher
            $teacher = Teacher::create([
                'user_id' => $user->id,
                'nip' => !empty($validated['nip']) ? $validated['nip'] : null,
                'phone' => !empty($validated['phone']) ? $validated['phone'] : null,
                'address' => !empty($validated['address']) ? $validated['address'] : null,
                'is_active' => true,
            ]);

            // Assign class to teacher
            if (!empty($validated['class_id'])) {
                \App\Models\ClassModel::where('id', $validated['class_id'])
                    ->update(['teacher_id' => $user->id]);
            }

            DB::commit();

            return redirect()->back()->with('success', 'Guru berhasil ditambahkan');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Gagal menambahkan guru: ' . $e->getMessage());
        }
    }

    /**
     * Update the specified teacher.
     */
    public function update(Request $request, Teacher $teacher)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('users')->ignore($teacher->user_id)],
            'password' => 'nullable|string|min:8|confirmed',
            'nip' => ['nullable', 'string', 'max:20', Rule::unique('teachers')->ignore($teacher->id)],
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'is_active' => 'boolean',
            'class_id' => 'nullable|exists:classes,id',
        ]);

        DB::beginTransaction();
        try {
            // Update user
            $userData = [
                'name' => $validated['name'],
                'email' => $validated['email'],
            ];

            if (!empty($validated['password'])) {
                $userData['password'] = Hash::make($validated['password']);
            }

            $teacher->user()->update($userData);

            // Update teacher
            $teacher->update([
                'nip' => !empty($validated['nip']) ? $validated['nip'] : null,
                'phone' => !empty($validated['phone']) ? $validated['phone'] : null,
                'address' => !empty($validated['address']) ? $validated['address'] : null,
                'is_active' => $validated['is_active'] ?? true,
            ]);

            // Update class assignment
            // First, remove this teacher from all classes
            \App\Models\ClassModel::where('teacher_id', $teacher->user_id)
                ->update(['teacher_id' => null]);

            // Then assign the new class
            if (!empty($validated['class_id'])) {
                \App\Models\ClassModel::where('id', $validated['class_id'])
                    ->update(['teacher_id' => $teacher->user_id]);
            }

            DB::commit();

            return redirect()->back()->with('success', 'Guru berhasil diupdate');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Gagal mengupdate guru: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified teacher.
     */
    public function destroy(Teacher $teacher)
    {
        DB::beginTransaction();
        try {
            // Delete user (will cascade delete teacher due to foreign key)
            $teacher->user()->delete();

            DB::commit();

            return redirect()->back()->with('success', 'Guru berhasil dihapus');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Gagal menghapus guru: ' . $e->getMessage());
        }
    }

    /**
     * Download Excel template for teacher import.
     */
    public function downloadTemplate()
    {
        return Excel::download(new TeacherTemplateExport, 'template_guru.xlsx');
    }

    /**
     * Import teachers from Excel file.
     */
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls|max:5120', // Max 5MB
        ]);

        try {
            $import = new TeacherImport();
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
                    'message' => "Import selesai dengan beberapa error. $imported guru berhasil diimport.",
                    'imported' => $imported,
                    'errors' => $errors,
                ], 422);
            }

            return response()->json([
                'success' => true,
                'message' => "$imported guru berhasil diimport",
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
}
