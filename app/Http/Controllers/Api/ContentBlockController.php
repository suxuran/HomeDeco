<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContentBlock;
use Illuminate\Http\JsonResponse;

class ContentBlockController extends Controller
{
    public function show($key): JsonResponse
    {
        $block = ContentBlock::where('key', $key)->firstOrFail();
        return response()->json($block);
    }
}