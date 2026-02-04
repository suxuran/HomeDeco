<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
   {
    Schema::create('products', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->string('slug')->unique(); // URL-friendly name
        $table->text('description')->nullable();
        $table->decimal('price', 10, 2); // 10 digits total, 2 decimals (e.g. 1234.56)
        $table->string('image')->nullable(); // Path to the image file
        $table->string('category')->nullable(); // Simple category string for now
        $table->boolean('is_featured')->default(false); // To highlight products on homepage
        $table->timestamps();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
