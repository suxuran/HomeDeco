<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class LatestOrders extends BaseWidget
{
    // Set the widget width to full
    protected int | string | array $columnSpan = 'full';
    
    // Sort order: Put this below the stats
    protected static ?int $sort = 2;

    public function table(Table $table): Table
    {
        return $table
            ->query(
                // Get the latest 5 orders
                Order::query()->latest()->limit(5)
            )
            ->columns([
                Tables\Columns\TextColumn::make('id')
                    ->label('Order ID')
                    ->sortable(),
                
                Tables\Columns\TextColumn::make('user.name')
                    ->label('Customer'),
                
                Tables\Columns\TextColumn::make('total_price')
                    ->money('USD'),
                
                Tables\Columns\BadgeColumn::make('status')
                    ->colors([
                        'warning' => 'pending',
                        'success' => 'delivered',
                        'danger' => 'cancelled',
                    ]),
                
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->label('Date'),
            ])
            ->actions([
                // Add a button to open the full order details
                Tables\Actions\Action::make('open')
                    ->url(fn (Order $record): string => route('filament.admin.resources.orders.edit', $record))
                    ->icon('heroicon-m-eye'),
            ]);
    }
}