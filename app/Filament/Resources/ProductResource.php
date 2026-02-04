<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProductResource\Pages;
use App\Filament\Resources\ProductResource\RelationManagers;
use App\Models\Product;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class ProductResource extends Resource
{
    protected static ?string $model = Product::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

 public static function form(Form $form): Form
{
    return $form
        ->schema([
            Forms\Components\TextInput::make('name')
                ->required()
                ->maxLength(255)
                ->live(onBlur: true)
                // Auto-generate slug from name
                ->afterStateUpdated(fn (string $operation, $state, Forms\Set $set) => 
                    $operation === 'create' ? $set('slug', \Illuminate\Support\Str::slug($state)) : null),

            Forms\Components\TextInput::make('slug')
                ->required()
                ->maxLength(255)
                ->unique(ignoreRecord: true),

            Forms\Components\Select::make('category')
                ->options([
                    'Furniture' => 'Furniture',
                    'Lighting' => 'Lighting',
                    'Decoration' => 'Decoration',
                    'Kitchen' => 'Kitchen',
                ])
                ->required(),

            Forms\Components\TextInput::make('price')
                ->numeric()
                ->prefix('$')
                ->required(),

            Forms\Components\FileUpload::make('image')
                ->image()
                ->directory('products') // Save images in storage/app/public/products
                ->columnSpanFull(),

            Forms\Components\Textarea::make('description')
                ->columnSpanFull(),
                
            Forms\Components\Toggle::make('is_featured')
                ->label('Featured Product'),
        ]);
}
    public static function table(Table $table): Table
{
    return $table
        ->columns([
            Tables\Columns\ImageColumn::make('image'),
            
            Tables\Columns\TextColumn::make('name')
                ->searchable()
                ->sortable(),
                
            Tables\Columns\TextColumn::make('category')
                ->sortable(),

            Tables\Columns\TextColumn::make('price')
                ->money('USD')
                ->sortable(),

            Tables\Columns\IconColumn::make('is_featured')
                ->boolean(),
        ])
        ->filters([
            //
        ])
        ->actions([
            Tables\Actions\EditAction::make(),
        ])
        ->bulkActions([
            Tables\Actions\BulkActionGroup::make([
                Tables\Actions\DeleteBulkAction::make(),
            ]),
        ]);
}

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListProducts::route('/'),
            'create' => Pages\CreateProduct::route('/create'),
            'edit' => Pages\EditProduct::route('/{record}/edit'),
        ];
    }
}
