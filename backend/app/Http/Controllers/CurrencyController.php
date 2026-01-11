<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class CurrencyController extends Controller
{
    /**
     * Convertir una cantidad de una moneda a otra.
     * Cache opcional para mejorar rendimiento.
     */
    public function convert(Request $request)
    {
        $request->validate([
            'from' => 'required|string|size:3',
            'to' => 'required|string|size:3',
            'amount' => 'required|numeric|min:0',
        ]);

        $from = strtoupper($request->from);
        $to = strtoupper($request->to);
        $amount = $request->amount;

        // Generar clave de cache única por combinación de monedas y cantidad
        $cacheKey = "currency_{$from}_{$to}_{$amount}";

        // Intentar obtener de cache
        $cached = Cache::get($cacheKey);
        if ($cached) {
            return response()->json([
                'success' => true,
                'source' => 'cache',
                'data' => $cached
            ]);
        }

        try {
            $response = Http::withOptions(['verify' => false])->get("https://api.exchangerate.host/convert", [
                'from' => $from,
                'to' => $to,
                'amount' => $amount,
                'access_key' => env('EXCHANGE_API_KEY')
            ]);

            if (!$response->successful()) {
                return response()->json([
                    'success' => false,
                    'error' => 'Error al obtener datos de la API externa'
                ], $response->status());
            }

            $data = $response->json();

            // traer tasa de cambio y resultado
            if (!isset($data['success']) || $data['success'] !== true) {
                return response()->json([
                    'success' => false,
                    'error' => $data['error'] ?? 'Error en API externa'
                ], 400);
            }

            $rate = $data['info']['quote'] ?? null;
            $result = $data['result'] ?? null;

            return response()->json([
                'success' => true,
                'source' => 'api',
                'rate' => $rate,      // tasa de cambio
                'converted_amount' => $result, // cantidad convertida
                'from' => $from,
                'to' => $to,
                'amount' => $amount
            ]);

            // Guardar en cache
            Cache::put($cacheKey, $data, env('CACHE_DURATION', 3600));

            return response()->json([
                'success' => true,
                'source' => 'api',
                'data' => $data
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener las tasas más recientes de todas las monedas.
     * Cache opcional.
     */
    public function rates(Request $request)
    {
        $base = strtoupper($request->query('base', 'USD'));
        $symbols = $request->query('symbols', null); // Coma separada, opcional

        $cacheKey = "rates_{$base}_" . ($symbols ?? 'all');

        $cached = Cache::get($cacheKey);
        if ($cached) {
            return response()->json([
                'success' => true,
                'source' => 'cache',
                'data' => $cached
            ]);
        }

        try {
            $params = ['base' => $base];
            if ($symbols) {
                $params['symbols'] = $symbols;
            }
            $params['access_key'] = env('EXCHANGE_API_KEY');

            $response = Http::withOptions(['verify' => false])
                ->get('https://api.exchangerate.host/latest', $params);

            if (!$response->successful()) {
                return response()->json([
                    'success' => false,
                    'error' => 'Error al obtener datos de la API externa'
                ], $response->status());
            }

            $data = $response->json();
            Cache::put($cacheKey, $data, env('CACHE_DURATION', 3600));

            return response()->json([
                'success' => true,
                'source' => 'api',
                'data' => $data
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
