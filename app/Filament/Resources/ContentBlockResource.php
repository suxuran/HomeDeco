<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ContentBlockResource\Pages;
use App\Models\ContentBlock;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class ContentBlockResource extends Resource
{
    protected static ?string $model = ContentBlock::class;
    protected static ?string $navigationIcon = 'heroicon-o-document-text';
    protected static ?string $navigationLabel = 'Site Content';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('key')
                    ->required()
                    ->disabled() // Locked to prevent breaking frontend
                    ->label('Page Key'),

                Forms\Components\Section::make('Hero Section')
                    ->schema([
                        Forms\Components\TextInput::make('title')->required(),
                        Forms\Components\Textarea::make('subtitle')->rows(3),
                    ]),

                Forms\Components\Section::make('Story Section')
                    ->description('The main content area with the image.')
                    ->schema([
                        Forms\Components\TextInput::make('section_title'),
                        Forms\Components\Textarea::make('body')
                            ->label('Story Text')
                            ->rows(8)
                            ->helperText('Use double new lines for separate paragraphs.'),
                        Forms\Components\FileUpload::make('image')
                            ->image()
                            ->directory('content')
                            ->label('Story Image'),
                    ]),

                Forms\Components\Section::make('Core Values')
                    ->collapsed()
                    ->schema([
                        Forms\Components\Repeater::make('meta.values')
                            ->label('Values List')
                            ->schema([
                                Forms\Components\Select::make('icon')
                                    ->options([
                                        'Award' => 'Award',
                                        'Users' => 'Users',
                                        'Target' => 'Target',
                                        'Heart' => 'Heart',
                                    ])->required(),
                                Forms\Components\TextInput::make('title')->required(),
                                Forms\Components\TextInput::make('description')->required(),
                            ])
                            ->columns(3)
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('key')->sortable(),
                Tables\Columns\TextColumn::make('title'),
                Tables\Columns\TextColumn::make('updated_at')->dateTime(),
            ])
            ->actions([Tables\Actions\EditAction::make()]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListContentBlocks::route('/'),
            'create' => Pages\CreateContentBlock::route('/create'),
            'edit' => Pages\EditContentBlock::route('/{record}/edit'),
        ];
    }
}