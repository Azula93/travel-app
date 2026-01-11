<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class TravelController extends Controller
{
    public function saveBudget(Request $request)
    {
        // Validación
        $validated = $request->validate([
            'budgetCOP' => ['required', 'numeric', 'min:1'],
        ]);

        // Guardar en sesión o en base de datos
        session(['budgetCOP' => $validated['budgetCOP']]);

        return response()->json([
            'message' => 'Presupuesto guardado correctamente',
            'budgetCOP' => $validated['budgetCOP'],
        ]);
    }
}
