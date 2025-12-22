<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ClassModel;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ClassController extends Controller
{
    /**
     * Store a newly created class.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:10'],
            'grade' => ['required', 'integer', 'min:7', 'max:9'],
            'section' => ['required', 'string', 'max:1'],
        ]);

        // Check if class already exists
        $exists = ClassModel::where('grade', $validated['grade'])
            ->where('section', strtoupper($validated['section']))
            ->exists();

        if ($exists) {
            return back()->withErrors([
                'section' => 'Kelas dengan tingkat dan seksi ini sudah ada.'
            ]);
        }

        ClassModel::create([
            'name' => $validated['name'],
            'grade' => $validated['grade'],
            'section' => strtoupper($validated['section']),
            'academic_year' => '2025/2026', // Default academic year
            'is_active' => true,
        ]);

        return back()->with('success', 'Kelas berhasil ditambahkan.');
    }

    /**
     * Update the specified class.
     */
    public function update(Request $request, ClassModel $class): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:10'],
            'grade' => ['required', 'integer', 'min:7', 'max:9'],
            'section' => ['required', 'string', 'max:1'],
        ]);

        // Check if class already exists (excluding current class)
        $exists = ClassModel::where('grade', $validated['grade'])
            ->where('section', strtoupper($validated['section']))
            ->where('id', '!=', $class->id)
            ->exists();

        if ($exists) {
            return back()->withErrors([
                'section' => 'Kelas dengan tingkat dan seksi ini sudah ada.'
            ]);
        }

        $class->update([
            'name' => $validated['name'],
            'grade' => $validated['grade'],
            'section' => strtoupper($validated['section']),
        ]);

        return back()->with('success', 'Kelas berhasil diperbarui.');
    }

    /**
     * Remove the specified class.
     */
    public function destroy(ClassModel $class): RedirectResponse
    {
        // Check if class has students
        if ($class->students()->count() > 0) {
            return back()->withErrors([
                'delete' => 'Tidak dapat menghapus kelas yang masih memiliki siswa.'
            ]);
        }

        $class->delete();

        return back()->with('success', 'Kelas berhasil dihapus.');
    }
}
