<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PricingPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'price',
        'period',
        'description',
        'features',
        'is_popular',
        'sort_order',
    ];

    // Automatically convert the JSON features to a PHP array
    protected $casts = [
        'features' => 'array',
        'is_popular' => 'boolean',
    ];
}