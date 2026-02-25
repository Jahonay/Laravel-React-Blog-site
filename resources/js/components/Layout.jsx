// resources/js/components/Layout.jsx
import { Link, useLocation } from 'react-router-dom';

// ─── Navbar ────────────────────────────────────────────────────────────────
export function Navbar() {
    const { pathname } = useLocation();
    const links = [
        { href: '/',        label: 'Home' },
        { href: '/blog',    label: 'Blog' },
    ];

    return (
        <header style={styles.header}>
            <nav style={styles.nav}>
                <Link to="/" style={styles.brand}>
                    <span style={styles.brandDot}>●</span> INKWELL
                </Link>
                <div style={styles.navLinks}>
                    {links.map(({ href, label }) => (
                        <Link
                            key={href}
                            to={href}
                            style={{
                                ...styles.navLink,
                                ...(pathname === href ? styles.navLinkActive : {}),
                            }}
                        >
                            {label}
                        </Link>
                    ))}
                </div>
            </nav>
        </header>
    );
}

// ─── Footer ────────────────────────────────────────────────────────────────
export function Footer() {
    return (
        <footer style={styles.footer}>
            <p style={styles.footerText}>
                © {new Date().getFullYear()} Inkwell — Built with Laravel &amp; React
            </p>
        </footer>
    );
}

// ─── PostCard ──────────────────────────────────────────────────────────────
export function PostCard({ post, featured = false }) {
    const date = new Date(post.published_at).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
    });

    return (
        <Link to={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <article
                style={{
                    ...styles.card,
                    ...(featured ? styles.cardFeatured : {}),
                }}
                className="post-card"
            >
                {post.cover_image && (
                    <div style={styles.cardImageWrap}>
                        <img
                            src={post.cover_image}
                            alt={post.title}
                            style={{
                                ...styles.cardImage,
                                ...(featured ? styles.cardImageFeatured : {}),
                            }}
                        />
                    </div>
                )}
                <div style={styles.cardBody}>
                    <span style={styles.badge}>{post.category}</span>
                    <h2 style={featured ? styles.cardTitleFeatured : styles.cardTitle}>
                        {post.title}
                    </h2>
                    <p style={styles.cardExcerpt}>{post.excerpt}</p>
                    <div style={styles.cardMeta}>
                        <span>{post.author?.name ?? 'Staff'}</span>
                        <span style={styles.metaDot}>·</span>
                        <span>{date}</span>
                        <span style={styles.metaDot}>·</span>
                        <span>{post.reading_time} min read</span>
                    </div>
                </div>
            </article>
        </Link>
    );
}

// ─── Inline styles (avoids extra CSS files for portability) ────────────────
const styles = {
    header: {
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(250, 247, 242, 0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #e8e0d4',
    },
    nav: {
        maxWidth: 1160, margin: '0 auto',
        padding: '0 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 64,
    },
    brand: {
        fontFamily: "'Playfair Display', serif",
        fontWeight: 700, fontSize: '1.25rem',
        letterSpacing: '0.08em',
        textDecoration: 'none', color: '#1a1208',
        display: 'flex', alignItems: 'center', gap: 6,
    },
    brandDot: { color: '#c9622f', fontSize: '0.7rem' },
    navLinks: { display: 'flex', gap: '2rem' },
    navLink: {
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '0.875rem', fontWeight: 500,
        letterSpacing: '0.04em', textDecoration: 'none',
        color: '#6b5b47',
        transition: 'color 0.2s',
    },
    navLinkActive: { color: '#c9622f' },
    footer: {
        marginTop: 96, borderTop: '1px solid #e8e0d4',
        padding: '2.5rem 2rem', textAlign: 'center',
    },
    footerText: {
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '0.8rem', color: '#9e8f7d',
    },

    // ── cards ──
    card: {
        background: '#fff',
        border: '1px solid #e8e0d4',
        borderRadius: 4,
        overflow: 'hidden',
        transition: 'transform 0.2s, box-shadow 0.2s',
        cursor: 'pointer',
    },
    cardFeatured: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
    },
    cardImageWrap: { overflow: 'hidden' },
    cardImage: {
        width: '100%', height: 220,
        objectFit: 'cover',
        display: 'block',
        transition: 'transform 0.4s',
    },
    cardImageFeatured: { height: '100%', minHeight: 280 },
    cardBody: { padding: '1.75rem' },
    badge: {
        display: 'inline-block',
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '0.7rem', fontWeight: 600,
        letterSpacing: '0.1em', textTransform: 'uppercase',
        background: '#fef3ec', color: '#c9622f',
        padding: '3px 10px', borderRadius: 2,
        marginBottom: 12,
    },
    cardTitle: {
        fontFamily: "'Playfair Display', serif",
        fontSize: '1.2rem', fontWeight: 700,
        color: '#1a1208', lineHeight: 1.3,
        margin: '0 0 10px',
    },
    cardTitleFeatured: {
        fontFamily: "'Playfair Display', serif",
        fontSize: '1.6rem', fontWeight: 700,
        color: '#1a1208', lineHeight: 1.25,
        margin: '0 0 12px',
    },
    cardExcerpt: {
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '0.875rem', color: '#6b5b47',
        lineHeight: 1.6, margin: '0 0 20px',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
    },
    cardMeta: {
        fontFamily: "'DM Sans', sans-serif",
        fontSize: '0.78rem', color: '#9e8f7d',
        display: 'flex', gap: 6, flexWrap: 'wrap',
    },
    metaDot: { color: '#c9622f' },
};
