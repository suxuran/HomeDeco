<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContentBlock extends Model
{
    protected $fillable = [
        'key', 'title', 'subtitle', 'section_title', 'body', 'image', 'meta'
    ];

    protected $casts = [
        'meta' => 'array',
    ];

    // Auto-append the full image URL to JSON responses
    protected $appends = ['image_url'];

    public function getImageUrlAttribute()
    {
        return $this->image ? asset('storage/' . $this->image) : null;
    }
}