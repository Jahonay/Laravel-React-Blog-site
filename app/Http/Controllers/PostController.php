<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{
    /**
     * GET /api/posts
     * Paginated list of published posts with optional category filter.
     */
    public function index(Request $request)
    {
        $posts = Post::published()
            ->recent()
            ->with('author:id,name,profile_photo_path')
            ->when($request->category, fn($q, $cat) => $q->where('category', $cat))
            ->when($request->search, fn($q, $s) =>
                $q->where('title', 'like', "%{$s}%")
                  ->orWhere('excerpt', 'like', "%{$s}%")
            )
            ->select('id', 'title', 'slug', 'excerpt', 'cover_image', 'category', 'reading_time', 'published_at', 'author_id')
            ->paginate(9);

        return response()->json($posts);
    }

    /**
     * GET /api/posts/featured
     * Returns 3 featured posts for the homepage hero.
     */
    public function featured()
    {
        $posts = Post::published()
            ->recent()
            ->with('author:id,name')
            ->select('id', 'title', 'slug', 'excerpt', 'cover_image', 'category', 'reading_time', 'published_at', 'author_id')
            ->limit(3)
            ->get();

        return response()->json($posts);
    }

     
    /**
     * GET /api/posts/{slug}
     * Single post by slug.
     */
    public function show(string $slug)
    {
        $post = Post::published()
            ->with('author:id,name,profile_photo_path')
            ->where('slug', $slug)
            ->firstOrFail();

        // Fetch related posts in the same category
        $related = Post::published()
            ->recent()
            ->where('category', $post->category)
            ->where('id', '!=', $post->id)
            ->select('id', 'title', 'slug', 'excerpt', 'cover_image', 'reading_time', 'published_at')
            ->limit(3)
            ->get();

        return response()->json([
            'post'    => $post,
            'related' => $related,
        ]);
    }

    /**
     * GET /api/categories
     * Returns all distinct post categories with counts.
     */
    public function categories()
    {
        $categories = Post::published()
            ->selectRaw('category, count(*) as count')
            ->groupBy('category')
            ->orderByDesc('count')
            ->get();

        return response()->json($categories);
    }
}
