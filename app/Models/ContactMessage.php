<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactMessage extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 
        'email', 
        'phone', // <--- Make sure this is here
        'subject', 
        'message', 
        'is_read'
    ];
}