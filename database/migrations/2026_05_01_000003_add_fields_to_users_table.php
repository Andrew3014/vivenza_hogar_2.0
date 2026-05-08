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
            // Campos de verificación de cuenta
            $table->boolean('is_account_verified')->default(false)->after('phone');
            $table->timestamp('account_verified_at')->nullable()->after('is_account_verified');
            
            // Estado de la cuenta
            $table->enum('account_status', ['activo', 'suspendido', 'eliminado'])->default('activo')->after('account_verified_at');
            
            // Documento de identidad (CI/RUT)
            $table->string('document_number')->nullable()->unique()->after('account_status');
            
            // Avatar/Foto de perfil
            $table->string('avatar_url')->nullable()->after('document_number');
            
            // Descripción/Bio
            $table->text('bio')->nullable()->after('avatar_url');
            
            // Ubicación específica del usuario
            $table->string('city')->nullable()->after('bio');
            $table->string('state')->nullable()->after('city');
            
            // Índices
            $table->index(['role', 'account_status']);
            $table->index('is_account_verified');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['role', 'account_status']);
            $table->dropIndex('is_account_verified_index');
            $table->dropUnique(['document_number']);
            $table->dropColumn([
                'is_account_verified',
                'account_verified_at',
                'account_status',
                'document_number',
                'avatar_url',
                'bio',
                'city',
                'state'
            ]);
        });
    }
};
