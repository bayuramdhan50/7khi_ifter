<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ParentModel;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\ParentTemplateExport;
use App\Imports\ParentImport;

class ParentController extends Controller
{
    /**
     * Download Excel template for parent import.
     */
    public function downloadTemplate()
    {
        return Excel::download(new ParentTemplateExport, 'template_orangtua.xlsx');
    }

    /**
     * Import parents from Excel file.
     */
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls|max:5120', // Max 5MB  
            'class_id' => 'required|exists:classes,id',
        ]);

        try {
            $import = new ParentImport($request->input('class_id'));
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
                    'message' => "Import selesai dengan beberapa error. $imported orang tua berhasil diimport.",
                    'imported' => $imported,
                    'errors' => $errors,
                ], 422);
            }

            return response()->json([
                'success' => true,
                'message' => "$imported orang tua berhasil diimport",
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
