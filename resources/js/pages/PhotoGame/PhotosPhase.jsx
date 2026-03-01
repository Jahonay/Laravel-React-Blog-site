import { useRef, useState } from 'react';
import { sharedStyles } from './shared';

export default function PhotosPhase({ state, myPlayerId, code, apiPost }) {
    const me = state.players?.find(p => p.id === myPlayerId);
    const alreadySubmitted = me?.photo_submitted;

    const [preview, setPreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const fileRef = useRef();
    const cameraRef = useRef();

    const submitted = state.players?.filter(p => p.photo_submitted) ?? [];
    const total = state.players?.length ?? 0;

    function handleFile(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => setPreview(ev.target.result);
        reader.readAsDataURL(file);
        setError('');
    }

    async function handleSubmit() {
        if (!preview) return;
        setSubmitting(true);
        setError('');
        try {
            await apiPost('photo', { url: preview });
        } catch (err) {
            setError(err.message);
            setSubmitting(false);
        }
    }

    return (
        <div className="pg">
            <style>{sharedStyles}{`
                .pg-photo-drop {
                    border: 2px dashed #2a2a3a;
                    border-radius: 16px;
                    padding: 2rem;
                    text-align: center;
                    cursor: pointer;
                    transition: border-color 0.2s, background 0.2s;
                    background: #0d0d14;
                }
                .pg-photo-drop:hover {
                    border-color: #f9c846;
                    background: rgba(249,200,70,0.03);
                }
                .pg-photo-preview {
                    width: 100%;
                    border-radius: 12px;
                    max-height: 360px;
                    object-fit: contain;
                    background: #0d0d14;
                }
            `}</style>
            <div className="pg__wrap">
                <div className="pg__header">
                    <div className="pg__code-badge">Room <span>{code}</span></div>
                    <div className="pg__phase-label">Photo Time!</div>
                </div>

                <div className="pg-prompt-pill">
                    <div className="pg-prompt-pill__label">📸 Today's Prompt</div>
                    <div className="pg-prompt-pill__text">{state.selected_prompt}</div>
                </div>

                <div className="pg-players" style={{ marginBottom: '1.5rem' }}>
                    {state.players?.map(p => (
                        <div key={p.id} className={`pg-player${p.photo_submitted ? ' pg-player--done' : ''}`}>
                            <div className="pg-player__dot" />
                            <span className="pg-player__name">{p.name}</span>
                            {p.photo_submitted && <span style={{ marginLeft: 'auto', fontSize: '0.8rem' }}>✓</span>}
                        </div>
                    ))}
                </div>

                {alreadySubmitted ? (
                    <div className="pg-waiting">
                        <div className="pg-waiting__spinner" />
                        <p style={{ margin: 0, fontSize: '0.9rem' }}>
                            Photo submitted! Waiting for others…<br />
                            <span style={{ color: '#666', fontSize: '0.8rem' }}>{submitted.length}/{total} submitted</span>
                        </p>
                    </div>
                ) : (
                    <div className="pg-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>
                            Your Photo
                        </p>

                        {preview ? (
                            <>
                                <img src={preview} alt="Preview" className="pg-photo-preview" />
                                <div style={{ display: 'flex', gap: '0.75rem' }}>
                                    <button
                                        className="pg-btn pg-btn--ghost"
                                        onClick={() => { setPreview(null); fileRef.current.value = ''; }}
                                        style={{ flex: 1 }}
                                    >
                                        Change Photo
                                    </button>
                                    <button
                                        className="pg-btn pg-btn--primary"
                                        onClick={handleSubmit}
                                        disabled={submitting}
                                        style={{ flex: 2 }}
                                    >
                                        {submitting ? 'Submitting…' : 'Submit Photo'}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Hidden file inputs */}
                                <input
                                    ref={fileRef}
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={handleFile}
                                />
                                <input
                                    ref={cameraRef}
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    style={{ display: 'none' }}
                                    onChange={handleFile}
                                />

                                <div
                                    className="pg-photo-drop"
                                    onClick={() => fileRef.current.click()}
                                >
                                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🖼️</div>
                                    <p style={{ margin: 0, color: '#888', fontSize: '0.9rem' }}>
                                        Click to upload a photo from your device
                                    </p>
                                    <p style={{ margin: '0.25rem 0 0', color: '#555', fontSize: '0.8rem' }}>
                                        JPG, PNG, GIF, WEBP accepted
                                    </p>
                                </div>

                                <button
                                    className="pg-btn pg-btn--ghost"
                                    onClick={() => cameraRef.current.click()}
                                >
                                    📷 Take a Photo with Camera
                                </button>
                            </>
                        )}
                        {error && <p className="pg-error">{error}</p>}
                    </div>
                )}
            </div>
        </div>
    );
}
