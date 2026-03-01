import { use, useState } from 'react';
import { router } from '@inertiajs/react';



export default function PhotoGameIndex() {
    const [mode, setMode] = useState(null); // 'host' | 'join'
    const [name, setName] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    async function handleCreate(e) {
        e.preventDefault();
        if (!name.trim()) return;
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/photo-game/api/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                },
                body: JSON.stringify({ name: name.trim() }),
            });
            const data = await res.json();
            console.log(data);
            console.log(res);
            if (!res.ok) throw new Error(data.message || 'Failed to create room');
            //router.visit(`/photo-game/${data.code}`);
            window.location.href = `/photo-game/${data.code}`;
        } catch (err) {
            console.log(err);
            setError(err.message);
            setLoading(false);
        }
    }

    async function handleJoin(e) {
        e.preventDefault();
        if (!name.trim() || !code.trim()) return;
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/photo-game/api/join', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                },
                body: JSON.stringify({ name: name.trim(), code: code.trim().toUpperCase() }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to join room');
            // router.visit(`/photo-game/${data.code}`);
            window.location.href = `/photo-game/${data.code}`;
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    }

    return (
        <div className="pg-entry">
            <div className="pg-entry__inner">
                <header className="pg-entry__header">
                    <div className="pg-entry__icon">📸</div>
                    <h1 className="pg-entry__title">SnapJudge</h1>
                    <p className="pg-entry__subtitle">
                        The photo game where everyone's a photographer — and everyone's a critic.
                    </p>
                </header>

                {!mode && (
                    <div className="pg-entry__actions">
                        <button
                            className="pg-btn pg-btn--primary"
                            onClick={() => setMode('host')}
                        >
                            🎮 Host a Game
                        </button>
                        <button
                            className="pg-btn pg-btn--secondary"
                            onClick={() => setMode('join')}
                        >
                            🔗 Join a Game
                        </button>
                    </div>
                )}

                {mode === 'host' && (
                    <form className="pg-form" onSubmit={handleCreate}>
                        <h2 className="pg-form__title">Create a Room</h2>
                        <input
                            className="pg-input"
                            type="text"
                            placeholder="Your name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            maxLength={20}
                            autoFocus
                        />
                        {error && <p className="pg-error">{error}</p>}
                        <div className="pg-form__row">
                            <button
                                type="button"
                                className="pg-btn pg-btn--ghost"
                                onClick={() => { setMode(null); setError(''); }}
                            >
                                ← Back
                            </button>
                            <button
                                type="submit"
                                className="pg-btn pg-btn--primary"
                                disabled={loading || !name.trim()}
                            >
                                {loading ? 'Creating…' : 'Create Room'}
                            </button>
                        </div>
                    </form>
                )}

                {mode === 'join' && (
                    <form className="pg-form" onSubmit={handleJoin}>
                        <h2 className="pg-form__title">Join a Room</h2>
                        <input
                            className="pg-input"
                            type="text"
                            placeholder="Your name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            maxLength={20}
                            autoFocus
                        />
                        <input
                            className="pg-input pg-input--code"
                            type="text"
                            placeholder="5-digit room code"
                            value={code}
                            onChange={e => setCode(e.target.value.toUpperCase())}
                            maxLength={5}
                        />
                        {error && <p className="pg-error">{error}</p>}
                        <div className="pg-form__row">
                            <button
                                type="button"
                                className="pg-btn pg-btn--ghost"
                                onClick={() => { setMode(null); setError(''); }}
                            >
                                ← Back
                            </button>
                            <button
                                type="submit"
                                className="pg-btn pg-btn--primary"
                                disabled={loading || !name.trim() || code.length !== 5}
                            >
                                {loading ? 'Joining…' : 'Join Room'}
                            </button>
                        </div>
                    </form>
                )}

                <div className="pg-entry__how">
                    <h3>How it works</h3>
                    <ol>
                        <li>Everyone writes 2–3 photo prompts</li>
                        <li>One prompt is picked at random</li>
                        <li>Everyone submits a photo that fits the prompt</li>
                        <li>Vote for your favorite — winner takes all!</li>
                    </ol>
                </div>
            </div>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');

                .pg-entry {
                    min-height: 100vh;
                    background: #0d0d14;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                    font-family: 'DM Sans', sans-serif;
                    color: #f0eee8;
                }

                .pg-entry__inner {
                    width: 100%;
                    max-width: 480px;
                }

                .pg-entry__header {
                    text-align: center;
                    margin-bottom: 2.5rem;
                }

                .pg-entry__icon {
                    font-size: 3.5rem;
                    line-height: 1;
                    margin-bottom: 0.5rem;
                }

                .pg-entry__title {
                    font-family: 'Syne', sans-serif;
                    font-size: 3rem;
                    font-weight: 800;
                    margin: 0;
                    background: linear-gradient(135deg, #f9c846 0%, #ff6b6b 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    letter-spacing: -1px;
                }

                .pg-entry__subtitle {
                    margin: 0.5rem 0 0;
                    color: #888;
                    font-size: 0.95rem;
                    line-height: 1.5;
                }

                .pg-entry__actions {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .pg-btn {
                    padding: 0.85rem 1.5rem;
                    border-radius: 12px;
                    border: none;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 1rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: transform 0.15s, opacity 0.15s, box-shadow 0.15s;
                    text-align: center;
                }

                .pg-btn:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
                }

                .pg-btn:active:not(:disabled) {
                    transform: translateY(0);
                }

                .pg-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .pg-btn--primary {
                    background: linear-gradient(135deg, #f9c846, #ff6b6b);
                    color: #0d0d14;
                    font-weight: 700;
                }

                .pg-btn--secondary {
                    background: #1e1e2e;
                    color: #f0eee8;
                    border: 1px solid #333;
                }

                .pg-btn--ghost {
                    background: transparent;
                    color: #888;
                    border: 1px solid #333;
                }

                .pg-form {
                    background: #141420;
                    border: 1px solid #222;
                    border-radius: 16px;
                    padding: 1.75rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .pg-form__title {
                    font-family: 'Syne', sans-serif;
                    font-size: 1.25rem;
                    font-weight: 700;
                    margin: 0 0 0.25rem;
                    color: #f0eee8;
                }

                .pg-form__row {
                    display: flex;
                    gap: 0.75rem;
                }

                .pg-form__row .pg-btn {
                    flex: 1;
                }

                .pg-input {
                    background: #0d0d14;
                    border: 1px solid #333;
                    border-radius: 10px;
                    padding: 0.75rem 1rem;
                    color: #f0eee8;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 1rem;
                    outline: none;
                    transition: border-color 0.2s;
                    width: 100%;
                    box-sizing: border-box;
                }

                .pg-input:focus {
                    border-color: #f9c846;
                }

                .pg-input--code {
                    letter-spacing: 0.2em;
                    text-align: center;
                    font-size: 1.25rem;
                    font-weight: 700;
                    text-transform: uppercase;
                }

                .pg-error {
                    color: #ff6b6b;
                    font-size: 0.875rem;
                    margin: 0;
                }

                .pg-entry__how {
                    margin-top: 2.5rem;
                    background: #141420;
                    border: 1px solid #222;
                    border-radius: 16px;
                    padding: 1.5rem;
                }

                .pg-entry__how h3 {
                    font-family: 'Syne', sans-serif;
                    font-size: 0.875rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    color: #888;
                    margin: 0 0 1rem;
                }

                .pg-entry__how ol {
                    margin: 0;
                    padding-left: 1.25rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .pg-entry__how li {
                    font-size: 0.9rem;
                    color: #c0bdb5;
                    line-height: 1.4;
                }
            `}</style>
        </div>
    );
}
