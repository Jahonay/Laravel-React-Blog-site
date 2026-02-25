// resources/js/pages/BlogArchive.jsx
import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../lib/api';
import { PostCard } from '../components/Layout';

export default function BlogArchive() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [posts, setPosts] = useState([]);
    const [meta, setMeta] = useState(null);   // pagination meta
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const currentPage = Number(searchParams.get('page')) || 1;
    const currentCategory = searchParams.get('category') || '';
    const currentSearch = searchParams.get('search') || '';

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        try {
            const data = await api.getPosts({
                page: currentPage,
                category: currentCategory || undefined,
                search: currentSearch || undefined,
            });
            setPosts(data.data);
            setMeta(data.meta ?? {
                current_page: data.current_page,
                last_page: data.last_page,
                total: data.total,
            });
            console.log(data);
        } catch (e) {
            console.error(e);
            console.log(api);
            console.log(api.getPosts());
        } finally {
            setLoading(false);
        }
    }, [currentPage, currentCategory, currentSearch]);

    useEffect(() => { fetchPosts(); }, [fetchPosts]);

    useEffect(() => {
        api.getCategories().then(setCategories).catch(console.error);
    }, []);

    function setParam(key, value) {
        const next = new URLSearchParams(searchParams);
        if (value) {
            next.set(key, value);
        } else {
            next.delete(key);
        }
        next.delete('page'); // reset to page 1 on filter change
        setSearchParams(next);
    }

    function goToPage(page) {
        const next = new URLSearchParams(searchParams);
        next.set('page', page);
        setSearchParams(next);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    return (
        <main>
            {/* ── Page header ─────────────────────── */}
            <section style={s.pageHeader}>
                <div style={s.container}>
                    <h1 style={s.pageTitle}>The Archive</h1>
                    <p style={s.pageSubtitle}>
                        {meta?.total ?? '…'} articles and growing.
                    </p>
                </div>
            </section>

            <div style={s.container}>
                {/* ── Filters ─────────────────────── */}
                <div style={s.filterBar}>
                    {/* Search */}
                    <input
                        type="text"
                        placeholder="Search posts…"
                        defaultValue={currentSearch}
                        style={s.searchInput}
                        onKeyDown={e => {
                            if (e.key === 'Enter') setParam('search', e.target.value.trim());
                        }}
                        onBlur={e => setParam('search', e.target.value.trim())}
                    />

                    {/* Category pills */}
                    <div style={s.pills}>
                        <button
                            style={{ ...s.pill, ...(currentCategory === '' ? s.pillActive : {}) }}
                            onClick={() => setParam('category', '')}
                        >
                            All
                        </button>
                        {categories.map(c => (
                            <button
                                key={c.category}
                                style={{ ...s.pill, ...(currentCategory === c.category ? s.pillActive : {}) }}
                                onClick={() => setParam('category', c.category)}
                            >
                                {c.category}
                                <span style={s.pillCount}>{c.count}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Post grid ────────────────────── */}
                {loading ? (
                    <p style={s.loadingText}>Loading…</p>
                ) : posts.length === 0 ? (
                    <p style={s.loadingText}>No posts found.</p>
                ) : (
                    <div style={s.grid}>
                        {posts.map(post => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>
                )}

                {/* ── Pagination ───────────────────── */}
                {meta && meta.last_page > 1 && (
                    <div style={s.pagination}>
                        <button
                            style={s.pageBtn}
                            disabled={currentPage <= 1}
                            onClick={() => goToPage(currentPage - 1)}
                        >
                            ← Prev
                        </button>
                        <span style={s.pageInfo}>
                            {currentPage} / {meta.last_page}
                        </span>
                        <button
                            style={s.pageBtn}
                            disabled={currentPage >= meta.last_page}
                            onClick={() => goToPage(currentPage + 1)}
                        >
                            Next →
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
}

// ── Styles ─────────────────────────────────────────────────────────────────
const s = {
    container: { maxWidth: 1160, margin: '0 auto', padding: '0 2rem' },
    pageHeader: {
        background: '#faf7f2',
        borderBottom: '1px solid #e8e0d4',
        padding: '4rem 2rem 3rem',
    },
    pageTitle: {
        fontFamily: "'Playfair Display', serif",
        fontSize: 'clamp(2.2rem, 4vw, 3.5rem)',
        fontWeight: 700, color: '#1a1208',
        margin: '0 0 10px',
    },
    pageSubtitle: {
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '1rem', color: '#6b5b47',
    },
    filterBar: {
        display: 'flex', alignItems: 'center',
        flexWrap: 'wrap', gap: 16,
        padding: '2rem 0 1.5rem',
        borderBottom: '1px solid #e8e0d4',
        marginBottom: 36,
    },
    searchInput: {
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '0.875rem',
        border: '1px solid #d4c9b9',
        borderRadius: 3,
        padding: '8px 14px',
        width: 220,
        outline: 'none',
        background: '#fff',
        color: '#1a1208',
    },
    pills: { display: 'flex', gap: 8, flexWrap: 'wrap' },
    pill: {
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '0.78rem', fontWeight: 600,
        letterSpacing: '0.05em',
        border: '1px solid #d4c9b9',
        background: '#fff',
        color: '#6b5b47',
        borderRadius: 3,
        padding: '6px 12px',
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 6,
        transition: 'all 0.15s',
    },
    pillActive: {
        background: '#c9622f', color: '#fff',
        borderColor: '#c9622f',
    },
    pillCount: {
        background: 'rgba(0,0,0,0.12)',
        borderRadius: 99, padding: '1px 6px',
        fontSize: '0.7rem',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: 28,
        marginBottom: 56,
    },
    pagination: {
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 20, padding: '3rem 0',
    },
    pageBtn: {
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '0.875rem', fontWeight: 600,
        border: '1px solid #d4c9b9',
        borderRadius: 3, background: '#fff',
        color: '#1a1208', padding: '8px 20px',
        cursor: 'pointer',
        '&:disabled': { opacity: 0.4, cursor: 'default' },
    },
    pageInfo: {
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '0.85rem', color: '#9e8f7d',
    },
    loadingText: {
        fontFamily: "'DM Sans', sans-serif",
        color: '#9e8f7d', fontStyle: 'italic',
        padding: '3rem 0',
    },
};
