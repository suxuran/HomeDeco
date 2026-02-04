<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PricingPlanResource\Pages;
use App\Models\PricingPlan;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class PricingPlanResource extends Resource
{
    protected static ?string $model = PricingPlan::class;

    protected static ?string $navigationIcon = 'heroicon-o-currency-dollar';
    protected static ?string $navigationLabel = 'Pricing Plans';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->required()
                    ->placeholder('e.g., Room Design'),
                
                Forms\Components\TextInput::make('price')
                    ->required()
                    ->placeholder('e.g., $2,500'),

                Forms\Components\TextInput::make('period')
                    ->required()
                    ->placeholder('e.g., per room'),

                Forms\Components\Toggle::make('is_popular')
                    ->label('Mark as Most Popular')
                    ->columnSpanFull(),

                Forms\Components\Textarea::make('description')
                    ->required()
                    ->columnSpanFull(),

                // This allows you to add multiple bullet points
                Forms\Components\TagsInput::make('features')
                    ->label('Features List')
                    ->placeholder('Type a feature and hit Enter')
                    ->columnSpanFull(),
                
                Forms\Components\TextInput::make('sort_order')
                    ->numeric()
                    ->default(0)
                    ->label('Sort Order (Lower numbers first)'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')->sortable(),
                Tables\Columns\TextColumn::make('price'),
                Tables\Columns\IconColumn::make('is_popular')->boolean(),
                Tables\Columns\TextColumn::make('sort_order')->sortable(),
            ])
            ->defaultSort('sort_order', 'asc')
            ->filters([])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPricingPlans::route('/'),
            'create' => Pages\CreatePricingPlan::route('/create'),
            'edit' => Pages\EditPricingPlan::route('/{record}/edit'),
        ];
    }
}