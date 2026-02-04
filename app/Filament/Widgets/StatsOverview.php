<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends BaseWidget
{
    // Reload stats every 15 seconds automatically
    protected static ?string $pollingInterval = '15s';

    protected function getStats(): array
    {
        return [
            Stat::make('Total Revenue', '$' . number_format(Order::where('status', '!=', 'cancelled')->sum('total_price'), 2))
                ->description('Lifetime earnings')
                ->descriptionIcon('heroicon-m-arrow-trending-up')
                ->color('success')
                ->chart([7, 2, 10, 3, 15, 4, 17]), // Fake mini-chart for visuals

            Stat::make('Active Orders', Order::whereIn('status', ['pending', 'processing', 'shipped'])->count())
                ->description('Orders needing attention')
                ->descriptionIcon('heroicon-m-shopping-bag')
                ->color('warning'),

            Stat::make('Total Customers', User::where('role', 'user')->count())
                ->description('Registered users')
                ->descriptionIcon('heroicon-m-users')
                ->color('info'),

            Stat::make('Low Stock Products', Product::where('stock', '<', 5)->count())
                ->description('Items needing restock')
                ->descriptionIcon('heroicon-m-exclamation-triangle')
                ->color('danger'),
        ];
    }
}