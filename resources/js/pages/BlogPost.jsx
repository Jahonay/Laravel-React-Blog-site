// resources/js/pages/BlogPost.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../lib/api';
import { PostCard } from '../components/Layout';

export default function BlogPost() {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        setLoading(true);
        setError(false);
        window.scrollTo(0, 0);

        api.getPost(slug)
            .then(({ post, related }) => {
                setPost(post);
                setRelated(related);
            })
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, [slug]);

    if (loading) return <div style={s.stateMsg}>Loading…</div>;
    if (error) return <div style={s.stateMsg}>Post not found. <Link to="/blog">← Back</Link></div>;

    const date = new Date(post.published_at).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric',
    });

    return (
        <main>
            {/* ── Cover image ─────────────────────────── */}
            {post.cover_image && (
                <div style={s.cover}>
                    <img src={post.cover_image} alt={post.title} style={s.coverImg} />
                    <div style={s.coverOverlay} />
                </div>
            )}

            {/* ── Article ──────────────────────────────── */}
            <div style={s.articleWrap}>
                <article style={s.article}>
                    {/* Breadcrumb */}
                    <div style={s.breadcrumb}>
                        <Link to="/" style={s.breadLink}>Home</Link>
                        <span style={s.breadSep}>/</span>
                        <Link to="/blog" style={s.breadLink}>Blog</Link>
                        <span style={s.breadSep}>/</span>
                        <span style={s.breadCurrent}>{post.category}</span>
                    </div>

                    {/* Header */}
                    <header style={s.header}>
                        <span style={s.badge}>{post.category}</span>
                        <h1 style={s.title}>{post.title}</h1>
                        <p style={s.excerpt}>{post.excerpt}</p>

                        <div style={s.byline}>
                            <div style={s.avatar}>
                                {post.author?.profile_photo_path
                                    ? <img src={post.author.profile_photo_path} alt={post.author.name} style={s.avatarImg} />
                                    : <span style={s.avatarInitial}>{(post.author?.name ?? '?')[0]}</span>
                                }
                            </div>
                            <div>
                                <div style={s.bylineAuthor}>{post.author?.name ?? 'Staff'}</div>
                                <div style={s.bylineMeta}>{date} · {post.reading_time} min read</div>
                            </div>
                        </div>
                    </header>

                    {/* Divider */}
                    <hr style={s.divider} />

                    {/* Body – renders HTML from Laravel */}
                    <div
                        style={s.body}
                        className="post-body"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </article>
            </div>

            {/* ── Related posts ────────────────────────── */}
            {related.length > 0 && (
                <section style={s.relatedSection}>
                    <div style={s.container}>
                        <h2 style={s.relatedTitle}>More in {post.category}</h2>
                        <div style={s.relatedGrid}>
                            {related.map(p => <PostCard key={p.id} post={p} />)}
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
}

// ── Styles ─────────────────────────────────────────────────────────────────
const s = {
    stateMsg: {
        fontFamily: "'DM Sans', sans-serif",
        maxWidth: 600, margin: '10vh auto',
        padding: '0 2rem', color: '#6b5b47',
        fontStyle: 'italic',
    },
    cover: {
        position: 'relative', height: 'clamp(260px, 40vh, 480px)',
        overflow: 'hidden', background: '#1a1208',
    },
    coverImg: {
        width: '100%', height: '100%',
        objectFit: 'cover', opacity: 0.75,
        display: 'block',
    },
    coverOverlay: {
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, transparent 40%, rgba(26,18,8,0.4))',
    },

    articleWrap: { background: '#faf7f2', padding: '0 2rem' },
    article: {
        maxWidth: 740, margin: '0 auto',
        padding: '3.5rem 0 4rem',
    },

    breadcrumb: {
        display: 'flex', alignItems: 'center', gap: 6,
        marginBottom: 28,
    },
    breadLink: {
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '0.78rem', color: '#9e8f7d',
        textDecoration: 'none',
    },
    breadSep: { color: '#c9c0b4', fontSize: '0.78rem' },
    breadCurrent: {
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '0.78rem', color: '#c9622f',
    },

    header: { marginBottom: 32 },
    badge: {
        display: 'inline-block',
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '0.7rem', fontWeight: 700,
        letterSpacing: '0.12em', textTransform: 'uppercase',
        background: '#fef3ec', color: '#c9622f',
        padding: '3px 10px', borderRadius: 2,
        marginBottom: 16,
    },
    title: {
        fontFamily: "'Playfair Display', serif",
        fontSize: 'clamp(2rem, 4vw, 3rem)',
        fontWeight: 700, color: '#1a1208',
        lineHeight: 1.2, margin: '0 0 18px',
    },
    excerpt: {
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '1.1rem', color: '#6b5b47',
        lineHeight: 1.65, margin: '0 0 28px',
        fontStyle: 'italic',
        borderLeft: '3px solid #c9622f',
        paddingLeft: 16,
    },
    byline: { display: 'flex', alignItems: 'center', gap: 14 },
    avatar: {
        width: 44, height: 44, borderRadius: '50%',
        background: '#e8e0d4', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
    },
    avatarImg: { width: '100%', height: '100%', objectFit: 'cover' },
    avatarInitial: {
        fontFamily: "'Playfair Display', serif",
        fontSize: '1.1rem', fontWeight: 700,
        color: '#c9622f',
    },
    bylineAuthor: {
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '0.875rem', fontWeight: 600, color: '#1a1208',
    },
    bylineMeta: {
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '0.78rem', color: '#9e8f7d',
        marginTop: 2,
    },

    divider: {
        border: 'none', borderTop: '1px solid #e8e0d4',
        margin: '2.5rem 0',
    },

    // prose styles injected into dangerouslySetInnerHTML content via global CSS
    body: {
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '1.05rem', color: '#3d2e1e',
        lineHeight: 1.8,
        whiteSpace: 'pre-wrap'
    },

    relatedSection: {
        background: '#fff', padding: '4rem 2rem 5rem',
        borderTop: '1px solid #e8e0d4',
    },
    container: { maxWidth: 1160, margin: '0 auto' },
    relatedTitle: {
        fontFamily: "'Playfair Display', serif",
        fontSize: '1.4rem', fontWeight: 700,
        color: '#1a1208', marginBottom: 28,
    },
    relatedGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 24,
    },
};
