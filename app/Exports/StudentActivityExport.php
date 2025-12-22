<?php

namespace App\Exports;

use App\Models\Activity;
use App\Models\Student;
use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class StudentActivityExport implements WithMultipleSheets
{
    protected $classId;
    protected $className;
    protected $startDate;
    protected $endDate;

    public function __construct($classId, $className, $startDate = null, $endDate = null)
    {
        $this->classId = $classId;
        $this->className = $className;
        $this->startDate = $startDate ? Carbon::parse($startDate) : Carbon::now()->startOfMonth();
        $this->endDate = $endDate ? Carbon::parse($endDate) : Carbon::now()->endOfMonth();
    }

    public function sheets(): array
    {
        $sheets = [];

        // Summary Sheet
        $sheets[] = new Sheets\SummarySheet($this->classId, $this->className, $this->startDate, $this->endDate);

        // Get all activities
        $activities = Activity::orderBy('order')->get();

        // Create a sheet for each activity
        foreach ($activities as $activity) {
            $sheets[] = new Sheets\ActivitySheet($activity, $this->classId, $this->className, $this->startDate, $this->endDate);
        }

        // Monthly Summary Sheet
        $sheets[] = new Sheets\MonthlySummarySheet($this->classId, $this->className, $this->startDate, $this->endDate);

        return $sheets;
    }
}
