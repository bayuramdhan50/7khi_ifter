<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\ParentModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Store a newly created admin user.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'username' => $validated['username'],
            'password' => Hash::make($validated['password']),
            'plain_password' => $validated['password'],
            'role' => User::ROLE_ADMIN,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Admin berhasil ditambahkan',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'role' => $user->role,
            ],
        ]);
    }

    /**
     * Update the specified user.
     */
    public function update(Request $request, User $user)
    {
        $rules = [
            'name' => 'required|string|max:255',
            'religion' => 'nullable|string|in:Islam,Kristen,Katolik,Hindu,Buddha,Konghucu',
            'password' => 'nullable|string|min:6',
            'role' => 'nullable|string|in:siswa,orangtua,guru,admin',
        ];

        // Only validate username for non-siswa (guru, orangtua, admin)
        if ($user->role !== User::ROLE_SISWA) {
            $rules['username'] = [
                'required',
                'string',
                'max:255',
                Rule::unique('users', 'username')->ignore($user->id),
            ];
        }

        $validated = $request->validate($rules);

        // Update user data
        $updateData = [
            'name' => $validated['name'],
        ];

        if (!empty($validated['religion'])) {
            $updateData['religion'] = $validated['religion'];
        }

        // Update role if provided
        if (!empty($validated['role'])) {
            $updateData['role'] = $validated['role'];
        }

        // Update username only for non-siswa
        if ($user->role !== User::ROLE_SISWA && !empty($validated['username'])) {
            $updateData['username'] = $validated['username'];
        }

        // Update password if provided
        if (!empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
            $updateData['plain_password'] = $validated['password'];
        }

        $user->update($updateData);

        return response()->json([
            'success' => true,
            'message' => 'Akun berhasil diupdate',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'role' => $user->role,
            ],
        ]);
    }

    /**
     * Remove the specified user.
     */
    public function destroy(User $user)
    {
        // Prevent deleting own account
        if ($user->id === auth()->id()) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak dapat menghapus akun sendiri',
            ], 403);
        }

        // Delete related records based on role
        switch ($user->role) {
            case User::ROLE_SISWA:
                Student::where('user_id', $user->id)->delete();
                break;
            case User::ROLE_GURU:
                Teacher::where('user_id', $user->id)->delete();
                break;
            case User::ROLE_ORANGTUA:
                ParentModel::where('user_id', $user->id)->delete();
                break;
        }

        // Delete user
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Akun berhasil dihapus',
        ]);
    }
}
