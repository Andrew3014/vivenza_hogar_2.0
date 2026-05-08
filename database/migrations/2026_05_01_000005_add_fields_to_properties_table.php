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
        Schema::table('properties', function (Blueprint $table) {
            // Coordenadas para mapas
            $table->decimal('latitude', 10, 8)->nullable()->after('area');
            $table->decimal('longitude', 11, 8)->nullable()->after('latitude');
            
            // Hasta cuándo está destacada
            $table->date('featured_until')->nullable()->after('longitude');
            
            // Contadores
            $table->integer('views_count')->default(0)->after('featured_until');
            $table->integer('inquiries_count')->default(0)->after('views_count');
            $table->integer('favorites_count')->default(0)->after('inquiries_count');
            
            // Amenidades (JSON array)
            $table->json('amenities')->nullable()->after('favorites_count');
            
            // Información adicional
            $table->string('parking_spaces')->nullable()->after('amenities');
            $table->string('furnished')->nullable()->after('parking_spaces'); // yes, no, partial
            $table->text('rules')->nullable()->after('furnished'); // Para reglas de la propiedad
            
            // Verificación y aprobación
            $table->timestamp('reviewed_at')->nullable()->after('rules');
            $table->foreignId('reviewed_by_user_id')->nullable()->constrained('users')->nullOnDelete()->after('reviewed_at');
            $table->text('review_notes')->nullable()->after('reviewed_by_user_id');
            
            // Índices
            $table->index(['user_id', 'status']);
            $table->index('views_count');
            $table->index('is_featured');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->dropIndex(['user_id', 'status']);
            $table->dropIndex('views_count_index');
            $table->dropIndex('is_featured_index');
            $table->dropForeign(['reviewed_by_user_id']);
            $table->dropColumn([
                'latitude',
                'longitude',
                'featured_until',
                'views_count',
                'inquiries_count',
                'favorites_count',
                'amenities',
                'parking_spaces',
                'furnished',
                'rules',
                'reviewed_at',
                'reviewed_by_user_id',
                'review_notes'
            ]);
        });
    }
};
