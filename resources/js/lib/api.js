// resources/js/lib/api.js
// ---------------------------------------------------------------------------
// Thin fetch wrapper — swap BASE_URL to your Laravel app's address.
// ---------------------------------------------------------------------------

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api';
//const BASE_URL = 'http://localhost:8000/api';
async function get(path, params = {}) {
    const url = new URL(BASE_URL + path, window.location.origin);
    Object.entries(params).forEach(([k, v]) => v != null && url.searchParams.set(k, v));
    const res = await fetch(url.toString(), {
        headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`API error ${res.status}`);
    return res.json();
}

export const api = {
    getFeaturedPosts: () => get('/posts/featured'),
    getPosts: (params) => get('/posts', params),
    getPost: (slug) => get(`/posts/${slug}`),
    getCategories: () => get('/categories'),
};
