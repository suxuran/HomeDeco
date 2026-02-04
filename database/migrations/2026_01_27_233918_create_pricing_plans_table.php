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
    Schema::create('pricing_plans', function (Blueprint $table) {
        $table->id();
        $table->string('name');          // e.g., "Consultation"
        $table->string('price');         // e.g., "$150"
        $table->string('period');        // e.g., "per session"
        $table->text('description');     // e.g., "Perfect for getting started..."
        $table->json('features');        // Stores the list of bullet points
        $table->boolean('is_popular')->default(false); // e.g., true/false
        $table->integer('sort_order')->default(0); // To control display order
        $table->timestamps();
    });
  }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pricing_plans');
    }
};
