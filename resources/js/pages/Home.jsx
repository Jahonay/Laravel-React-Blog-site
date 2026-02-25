// resources/js/pages/Home.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { PostCard } from '../components/Layout';

export default function Home() {
    const [featured, setFeatured] = useState([]);
    const [loading, setLoading]   = useState(true);

    useEffect(() => {
        api.getFeaturedPosts()
            .then(setFeatured)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <main>
            {/* ── Hero ────────────────────────────────── */}
            <section style={s.hero}>
                <div style={s.heroInner}>
                    <p style={s.heroEyebrow}>A journal of ideas</p>
                    <h1 style={s.heroTitle}>
                        Stories worth<br />
                        <em style={s.heroTitleEm}>reading twice.</em>
                    </h1>
                    <p style={s.heroSub}>
                        Thoughtful essays, deep-dives, and commentary on the things that matter.
                    </p>
                    <Link to="/blog" style={s.heroCTA}>
                        Explore the archive →
                    </Link>
                </div>
                {/* Decorative rule */}
                <div style={s.heroRule} />
            </section>

            {/* ── Featured posts ──────────────────────── */}
            <section style={s.section}>
                <div style={s.container}>
                    <h2 style={s.sectionLabel}>Featured</h2>

                    {loading && <p style={s.loadingText}>Loading…</p>}

                    {!loading && featured.length > 0 && (
                        <div style={s.featuredGrid}>
                            {/* First post gets the wide card */}
                            <PostCard post={featured[0]} featured />

                            {/* Remaining posts in a side column */}
                            <div style={s.featuredSide}>
                                {featured.slice(1).map(post => (
                                    <PostCard key={post.id} post={post} />
                                ))}
                            </div>
                        </div>
                    )}

                    <div style={s.archiveLink}>
                        <Link to="/blog" style={s.textLink}>
                            See all posts →
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}

// ── Styles ─────────────────────────────────────────────────────────────────
const s = {
    hero: {
        background: '#faf7f2',
        borderBottom: '1px solid #e8e0d4',
        padding: '7rem 2rem 5rem',
        position: 'relative',
        overflow: 'hidden',
    },
    heroInner: {
        maxWidth: 700, margin: '0 auto',
        textAlign: 'center',
        position: 'relative', zIndex: 1,
    },
    heroEyebrow: {
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '0.78rem', fontWeight: 600,
        letterSpacing: '0.14em', textTransform: 'uppercase',
        color: '#c9622f', marginBottom: 20,
    },
    heroTitle: {
        fontFamily: "'Playfair Display', serif",
        fontSize: 'clamp(2.8rem, 6vw, 5rem)',
        fontWeight: 700, color: '#1a1208',
        lineHeight: 1.1, margin: '0 0 24px',
    },
    heroTitleEm: {
        fontStyle: 'italic', color: '#c9622f',
    },
    heroSub: {
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '1.05rem', color: '#6b5b47',
        lineHeight: 1.7, maxWidth: 520,
        margin: '0 auto 36px',
    },
    heroCTA: {
        display: 'inline-block',
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '0.875rem', fontWeight: 600,
        letterSpacing: '0.06em',
        color: '#fff', background: '#c9622f',
        padding: '12px 28px', borderRadius: 3,
        textDecoration: 'none',
        transition: 'background 0.2s',
    },
    heroRule: {
        position: 'absolute', bottom: 0, left: '10%',
        width: '80%', height: 1,
        background: 'linear-gradient(90deg, transparent, #c9622f44, transparent)',
    },

    section: { padding: '5rem 0' },
    container: { maxWidth: 1160, margin: '0 auto', padding: '0 2rem' },
    sectionLabel: {
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '0.72rem', fontWeight: 700,
        letterSpacing: '0.16em', textTransform: 'uppercase',
        color: '#9e8f7d', marginBottom: 28,
        paddingBottom: 12, borderBottom: '1px solid #e8e0d4',
    },
    featuredGrid: {
        display: 'grid',
        gridTemplateColumns: '3fr 2fr',
        gap: 24,
        alignItems: 'start',
    },
    featuredSide: { display: 'flex', flexDirection: 'column', gap: 20 },
    archiveLink: { marginTop: 40, textAlign: 'right' },
    textLink: {
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '0.875rem', fontWeight: 600,
        color: '#c9622f', textDecoration: 'none',
    },
    loadingText: {
        fontFamily: "'DM Sans', sans-serif",
        color: '#9e8f7d', fontStyle: 'italic',
    },
};
