<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function checkout(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'shipping_address' => 'required|string',
        ]);

        return DB::transaction(function () use ($request) {
            $totalPrice = 0;
            $orderItemsData = [];

            foreach ($request->items as $item) {
                $product = Product::find($item['id']);
                
                if ($product->stock < $item['quantity']) {
                    throw new \Exception("Product {$product->name} is out of stock.");
                }

                $totalPrice += $product->price * $item['quantity'];
                $product->decrement('stock', $item['quantity']);

                $orderItemsData[] = [
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $product->price,
                ];
            }

            $order = Order::create([
                'user_id' => $request->user()->id,
                'total_price' => $totalPrice,
                'status' => 'pending',
                'shipping_address' => $request->shipping_address,
            ]);

            foreach ($orderItemsData as $data) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $data['product_id'],
                    'quantity' => $data['quantity'],
                    'price' => $data['price']
                ]);
            }

            return response()->json(['message' => 'Order placed!', 'order_id' => $order->id], 201);
        });
    }

    public function index(Request $request)
    {
        return response()->json(
            Order::with('items.product')
                ->where('user_id', $request->user()->id)
                ->orderBy('created_at', 'desc')
                ->get()
        );
    }
}