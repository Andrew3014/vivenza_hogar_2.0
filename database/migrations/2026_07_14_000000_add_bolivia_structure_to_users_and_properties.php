<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('document_extension', 10)->nullable()->after('document_number');
            $table->index('document_extension');
        });

        Schema::table('properties', function (Blueprint $table) {
            $table->enum('transaction_type', ['venta', 'alquiler', 'anticretico', 'alquiler_diario'])
                ->default('venta')
                ->after('price');
            $table->enum('currency', ['USD', 'BOB'])
                ->default('USD')
                ->after('transaction_type');
            $table->boolean('anticretico_registered_ddrr')
                ->default(false)
                ->after('currency');
            $table->unsignedSmallInteger('contract_duration_years')
                ->nullable()
                ->after('anticretico_registered_ddrr');
            $table->unsignedSmallInteger('min_stay_days')
                ->nullable()
                ->after('contract_duration_years');
            $table->boolean('requires_guarantee')
                ->default(false)
                ->after('min_stay_days');
            $table->decimal('guarantee_amount', 12, 2)
                ->nullable()
                ->after('requires_guarantee');

            $table->index('transaction_type');
            $table->index('currency');
        });

        // Keep the legacy `type` column compatible while old clients migrate
        // to `transaction_type`. Without this, anticretico and daily rent
        // inserts would fail against the original enum definition.
        DB::statement("ALTER TABLE properties MODIFY type ENUM('venta', 'alquiler', 'anticretico', 'alquiler_diario') NOT NULL");

        // The new column has a default, so old rows are never NULL here. Copy
        // the legacy value explicitly or every old rental would become a sale.
        DB::statement("UPDATE properties SET transaction_type = type WHERE type IN ('venta', 'alquiler')");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("UPDATE properties SET type = 'venta' WHERE type IN ('anticretico', 'alquiler_diario')");
        DB::statement("ALTER TABLE properties MODIFY type ENUM('venta', 'alquiler') NOT NULL");

        Schema::table('properties', function (Blueprint $table) {
            $table->dropIndex(['transaction_type']);
            $table->dropIndex(['currency']);
            $table->dropColumn([
                'transaction_type',
                'currency',
                'anticretico_registered_ddrr',
                'contract_duration_years',
                'min_stay_days',
                'requires_guarantee',
                'guarantee_amount',
            ]);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['document_extension']);
            $table->dropColumn('document_extension');
        });
    }
};
