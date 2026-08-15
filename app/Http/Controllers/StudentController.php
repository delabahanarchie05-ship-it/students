<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index()
    {
        return Inertia::render('dashboard', [
            'students' => Student::query()->latest()->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'student_id' => 'required|string|max:20|unique:students,student_id',
            'full_name' => 'required|string|max:255',
            'gender' => 'required|in:Male,Female',
            'date_of_birth' => 'required|date',
            'year_level' => 'required|string|max:20',
            'section' => 'required|string|max:50',
            'contact_number' => 'required|string|max:20',
        ]);

        Student::create($data);

        return redirect()->route('dashboard')
            ->with('success', 'Student record created successfully.');
    }

    public function update(Request $request, Student $student)
    {
        $data = $request->validate([
            'student_id' => [
                'required', 'string', 'max:20',
                Rule::unique('students', 'student_id')->ignore($student->id),
            ],
            'full_name' => 'required|string|max:255',
            'gender' => 'required|in:Male,Female',
            'date_of_birth' => 'required|date',
            'year_level' => 'required|string|max:20',
            'section' => 'required|string|max:50',
            'contact_number' => 'required|string|max:20',
        ]);

        $student->update($data);

        return redirect()->route('dashboard')
            ->with('success', 'Student record updated successfully.');
    }

    public function destroy(Student $student)
    {
        $student->delete();

        return redirect()->route('dashboard')
            ->with('success', 'Student record deleted successfully.');
    }
}