<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\History;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HistoryController extends Controller
{
    public function index()
    {
        $histories = DB::table('histories')
            ->orderBy('date', 'desc')
            ->limit(5)
            ->get();

        return response()->json($histories);
    }
    public function store(Request $request)
    {
        $request->validate([
            'countryKey' => 'required|string',
            'cityKey' => 'required|string',
            'originalAmount' => 'required|numeric',
            'convertedAmount' => 'required|numeric',
            'currencySymbol' => 'required|string',


        ]);


        $data = [
            'countryKey' => $request->countryKey,
            'cityKey' => $request->cityKey,
            'originalAmount' => $request->originalAmount,
            'convertedAmount' => $request->convertedAmount,
            'currencySymbol' => $request->currencySymbol,
            'date' => now('America/Bogota'),
        ];



        $history = History::create($data);
        return response()->json($history, 201);
    }
}
