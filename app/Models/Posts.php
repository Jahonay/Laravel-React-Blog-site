<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Posts extends Model
{
    //
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'author_id',
        'id', 
        'author_id', 
        'title', 
        'slug', 
        'excerpt', 
        'content', 
        'cover_image', 
        'category', 
        'reading_time', 
        'published_at', 
        'created_at', 
        'updated_at'
    ];
}
