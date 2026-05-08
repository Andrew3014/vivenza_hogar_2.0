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
        Schema::table('inquiries', function (Blueprint $table) {
            // Forma de contacto (WhatsApp o mensaje interno)
            $table->enum('contact_via', ['whatsapp', 'mensaje', 'email'])->default('whatsapp')->after('message');
            
            // Teléfono del vendedor (desnormalizado para acceso rápido)
            $table->string('seller_phone')->nullable()->after('contact_via');
            
            // Si el comprador está verificado
            $table->boolean('buyer_verified')->default(false)->after('seller_phone');
            
            // Estado de la inquietud
            $table->enum('inquiry_status', ['pendiente', 'respondido', 'finalizado', 'rechazado'])->default('pendiente')->after('buyer_verified');
            
            // Prioridad
            $table->enum('priority', ['baja', 'media', 'alta'])->default('media')->after('inquiry_status');
            
            // Índices
            $table->index('inquiry_status');
            $table->index('buyer_verified');
            $table->index(['property_id', 'inquiry_status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('inquiries', function (Blueprint $table) {
            $table->dropIndex(['property_id', 'inquiry_status']);
            $table->dropIndex('inquiry_status_index');
            $table->dropIndex('buyer_verified_index');
            $table->dropColumn([
                'contact_via',
                'seller_phone',
                'buyer_verified',
                'inquiry_status',
                'priority'
            ]);
        });
    }
};
