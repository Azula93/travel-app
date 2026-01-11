<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\HistoryController;
use App\Http\Controllers\Api\TravelController;
use App\Http\Controllers\CurrencyController;



/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/history', [HistoryController::class, 'index']);
Route::post('/history', [HistoryController::class, 'store']);
Route::get('/weather', [App\Http\Controllers\Api\WeatherController::class, 'getWeather']);
Route::post('/save-budget', [TravelController::class, 'saveBudget']);


Route::get('/convert', [CurrencyController::class, 'convert']);
Route::get('/rates', [CurrencyController::class, 'rates']);
Route::get('/convert-currency', [CurrencyController::class, 'convertCurrency']);
