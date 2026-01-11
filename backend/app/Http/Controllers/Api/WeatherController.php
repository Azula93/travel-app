<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class WeatherController extends Controller
{
    public function getWeather(Request $request)
    {
        $city = $request->query('city');

        if (!$city) {
            return response()->json(['error' => 'City is required'], 400);
        }

        $apiKey = env('OPEN_WEATHER_KEY');
        if (!$apiKey) {
            return response()->json(['error' => 'API key is not set'], 500);
        }

        try {
            // Deshabilitar verificación SSL - SOLO PARA DESARROLLO
            $response = Http::timeout(15)
                ->withOptions(['verify' => false])
                ->get('https://api.openweathermap.org/data/2.5/weather', [
                    'q'     => $city,
                    'units' => 'metric',
                    'appid' => $apiKey,
                ]);

            if ($response->failed()) {
                $statusCode = $response->status();

                if ($statusCode === 401) {
                    return response()->json(['error' => 'Invalid API key'], 401);
                } elseif ($statusCode === 404) {
                    return response()->json(['error' => 'City not found'], 404);
                } else {
                    return response()->json(['error' => 'Failed to fetch weather data'], 500);
                }
            }

            $data = $response->json();

            return response()->json([
                'success' => true,
                'data' => [
                    'name' => $data['name'],
                    'main' => $data['main'],
                    'weather' => $data['weather'],
                    'wind' => $data['wind'] ?? ['speed' => 0],
                    'sys' => $data['sys'] ?? ['country' => '']
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Exception occurred: ' . $e->getMessage()
            ], 500);
        }
    }
}
