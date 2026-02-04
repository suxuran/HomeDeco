<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('content_blocks', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique(); // e.g., 'about_page'
            $table->string('title');         // Hero Title
            $table->text('subtitle')->nullable(); // Hero Description
            $table->string('section_title')->nullable(); // "Our Story"
            $table->longText('body')->nullable(); // Story Body
            $table->string('image')->nullable();  // Story Image
            $table->json('meta')->nullable();     // For extra data like "Values"
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('content_blocks');
    }
};