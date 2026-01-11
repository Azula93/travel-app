<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateHistoriesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('histories', function (Blueprint $table) {
            $table->id();
            $table->string('countryKey');          // Nombre o código del país
            $table->string('cityKey');             // Nombre o código de la ciudad
            $table->decimal('originalAmount', 15, 2);  // Monto en COP
            $table->decimal('convertedAmount', 15, 2); // Monto convertido
            $table->string('currencySymbol');      // Símbolo de la moneda destino
            $table->timestamp('date')->nullable(); // Fecha de la consulta
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('histories');
    }
}
