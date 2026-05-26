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
        Schema::table('users', function (Blueprint $table) {
            // Número de WhatsApp del usuario para contacto directo
            // Formato: +1234567890 (con código de país)
            $table->string('whatsapp_number')->nullable()->after('phone');
            
            // Indicar si el usuario desea que se vea su número
            $table->boolean('whatsapp_visible')->default(false)->after('whatsapp_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['whatsapp_number', 'whatsapp_visible']);
        });
    }
};
