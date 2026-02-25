<?php

namespace App\Filament\Resources\Posts\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class PostsForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('author_id')
                    ->required()
                    ->numeric(),
                TextInput::make('title')
                    ->required(),
                TextInput::make('slug')
                    ->required(),
                Textarea::make('excerpt')
                    ->required()
                    ->columnSpanFull(),
                Textarea::make('content')
                    ->required()
                    ->columnSpanFull(),
                FileUpload::make('cover_image')
                    ->image(),
                TextInput::make('category')
                    ->required()
                    ->default('General'),
                TextInput::make('reading_time')
                    ->required()
                    ->numeric()
                    ->default(1),
                DateTimePicker::make('published_at'),
            ]);
    }
}
