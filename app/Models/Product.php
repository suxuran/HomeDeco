<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 
        'slug',         // <--- ADDED THIS
        'category', 
        'price', 
        'description', 
        'image', 
        'stock',
        'is_featured',  // <--- ADDED THIS (Since you use it in Filament)
    ];

    // Always include 'image_url' in the JSON response
    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        // If the database column is empty, return null
        if (!$this->image) {
            return null;
        }

        // If it's already a full URL (like from Unsplash/Faker), return it as is
        if (str_starts_with($this->image, 'http')) {
            return $this->image;
        }

        // Otherwise, generate the local URL: http://127.0.0.1:8000/storage/folder/image.jpg
        return asset('storage/' . $this->image);
    }
}