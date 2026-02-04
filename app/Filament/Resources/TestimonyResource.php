<?php

namespace App\Filament\Resources;

use App\Filament\Resources\TestimonyResource\Pages;
use App\Filament\Resources\TestimonyResource\RelationManagers;
use App\Models\Testimony;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class TestimonyResource extends Resource
{
    protected static ?string $model = Testimony::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                // 1. Select User (Find user by name)
                Forms\Components\Select::make('user_id')
                    ->relationship('user', 'name')
                    ->searchable()
                    ->preload()
                    ->required()
                    ->label('Customer'),

                // 2. Rating (Dropdown 1-5)
                Forms\Components\Select::make('rating')
                    ->options([
                        1 => '1 Star',
                        2 => '2 Stars',
                        3 => '3 Stars',
                        4 => '4 Stars',
                        5 => '5 Stars',
                    ])
                    ->required()
                    ->default(5),

                // 3. Approval Toggle
                Forms\Components\Toggle::make('is_approved')
                    ->label('Approved for Public')
                    ->default(false),

                // 4. Content (Full width)
                Forms\Components\Textarea::make('content')
                    ->required()
                    ->columnSpanFull() // Makes it take up the whole width
                    ->rows(5),
            ]);
    }

    public static function table(Table $table): Table
    {
    return $table
        ->columns([
            Tables\Columns\TextColumn::make('user.name')
                ->label('Customer')
                ->searchable(),
            
            Tables\Columns\TextColumn::make('rating')
                ->numeric()
                ->sortable(),

            Tables\Columns\TextColumn::make('content')
                ->limit(50),
            
            // This toggle lets you approve/reject instantly
            Tables\Columns\ToggleColumn::make('is_approved')
                ->label('Approved'),

            Tables\Columns\TextColumn::make('created_at')
                ->dateTime()
                ->sortable(),
        ])
        ->filters([
            // Filter to show only pending reviews
            Tables\Filters\TernaryFilter::make('is_approved')
                ->label('Approval Status'),
        ])
        ->actions([
            Tables\Actions\EditAction::make(),
            Tables\Actions\DeleteAction::make(),
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
            'index' => Pages\ListTestimonies::route('/'),
            'create' => Pages\CreateTestimony::route('/create'),
            'edit' => Pages\EditTestimony::route('/{record}/edit'),
        ];
    }
}
