<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    /** @use HasFactory<\Database\Factories\StudentFactory> */
    use HasFactory;

    protected $fillable = [
        'student_id',
        'full_name',
        'gender',
        'date_of_birth',
        'year_level',
        'section',
        'contact_number',
    ];
}