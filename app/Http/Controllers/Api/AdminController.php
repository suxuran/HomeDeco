<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function stats()
    {
        // 1. Total Revenue: Sum of all orders that are NOT cancelled
        $totalRevenue = Order::where('status', '!=', 'cancelled')->sum('total_price');

        // 2. Active Orders: Orders needing attention (pending, processing, shipped)
        $activeOrders = Order::whereIn('status', ['pending', 'processing', 'shipped'])->count();

        // 3. Total Customers: Users who are not admins
        $totalCustomers = User::where('role', 'user')->count();

        // 4. Low Stock Products: Products with less than 5 items
        $lowStock = Product::where('stock', '<', 5)->count();

        // 5. Recent Orders: Get the last 5 orders for the list
        $recentOrders = Order::with('user')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return response()->json([
            'revenue' => $totalRevenue,
            'active_orders' => $activeOrders,
            'customers' => $totalCustomers,
            'low_stock' => $lowStock,
            'recent_orders' => $recentOrders
        ]);
    }
}