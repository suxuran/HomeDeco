<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ContentBlock;

class ContentBlockSeeder extends Seeder
{
    public function run(): void
    {
        ContentBlock::updateOrCreate(
            ['key' => 'about_page'],
            [
                'title' => 'About Home-Deco',
                'subtitle' => 'We are passionate interior designers dedicated to transforming spaces into beautiful, functional homes that reflect your unique style and personality.',
                'section_title' => 'Our Story',
                // Combined your two paragraphs with a double newline
                'body' => "Founded in 2009, Home-Deco began as a small design studio with a big dream: to make beautiful interior design accessible to everyone. Today, we've grown into a full-service design company, but our commitment to personalized service and exceptional quality remains unchanged.\n\nWe believe that your home should be a reflection of who you are. That's why we work closely with each client to understand their lifestyle, preferences, and dreams, creating spaces that are both beautiful and perfectly tailored to their needs.",
                'meta' => [
                    'values' => [
                        ['icon' => 'Award', 'title' => 'Excellence', 'description' => 'We strive for perfection in every project we undertake.'],
                        ['icon' => 'Users', 'title' => 'Collaboration', 'description' => 'Working closely with clients to bring their vision to life.'],
                        ['icon' => 'Target', 'title' => 'Innovation', 'description' => 'Embracing new trends and technologies in home design.'],
                        ['icon' => 'Heart', 'title' => 'Passion', 'description' => 'Our love for design drives everything we do.'],
                    ]
                ]
            ]
        );
    }
}