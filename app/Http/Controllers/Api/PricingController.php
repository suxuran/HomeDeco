<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PricingPlan;
use Illuminate\Http\JsonResponse;

class PricingController extends Controller
{
    public function index(): JsonResponse
    {
        $plans = PricingPlan::orderBy('sort_order', 'asc')->get();
        return response()->json($plans);
    }
}