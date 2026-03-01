import { useState } from 'react';
import { sharedStyles } from './shared';

export default function PromptsPhase({ state, myPlayerId, code, apiPost }) {
    const me = state.players?.find(p => p.id === myPlayerId);
    const alreadySubmitted = me?.prompts_submitted;

    const [prompts, setPrompts] = useState(['', '', '']);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const validPrompts = prompts.filter(p => p.trim().length > 0);
    const canSubmit = validPrompts.length >= 2;

    function updatePrompt(index, value) {
        const next = [...prompts];
        next[index] = value;
        setPrompts(next);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            await apiPost('prompts', { prompts: validPrompts });
        } catch (err) {
            setError(err.message);
            setSubmitting(false);
        }
    }

    const submitted = state.players?.filter(p => p.prompts_submitted) ?? [];
    const total = state.players?.length ?? 0;

    return (
        <div className="pg">
            <style>{sharedStyles}</style>
            <div className="pg__wrap">
                <div className="pg__header">
                    <div className="pg__code-badge">Room <span>{code}</span></div>
                    <div className="pg__phase-label">Writing Prompts</div>
                </div>

                <h1 className="pg__title">Write your prompts</h1>
                <p className="pg__subtitle">
                    Come up with 2–3 photo prompts. One will be chosen at random for everyone to photograph!
                </p>

                <div className="pg-players" style={{ marginBottom: '1.5rem' }}>
                    {state.players?.map(p => (
                        <div key={p.id} className={`pg-player${p.prompts_submitted ? ' pg-player--done' : ''}`}>
                            <div className="pg-player__dot" />
                            <span className="pg-player__name">{p.name}</span>
                            {p.prompts_submitted && <span style={{ marginLeft: 'auto', fontSize: '0.8rem' }}>✓</span>}
                        </div>
                    ))}
                </div>

                {alreadySubmitted ? (
                    <div className="pg-waiting">
                        <div className="pg-waiting__spinner" />
                        <p style={{ margin: 0, fontSize: '0.9rem' }}>
                            Your prompts are in! Waiting for others…<br />
                            <span style={{ color: '#666', fontSize: '0.8rem' }}>{submitted.length}/{total} submitted</span>
                        </p>
                    </div>
                ) : (
                    <form className="pg-card" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <p style={{ margin: '0 0 0.25rem', fontSize: '0.8rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>
                            Your Prompts (2 required, 3 max)
                        </p>
                        {prompts.map((p, i) => (
                            <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <span style={{ color: '#555', fontSize: '0.85rem', minWidth: '1.25rem' }}>{i + 1}.</span>
                                <input
                                    className="pg-input"
                                    type="text"
                                    placeholder={i < 2 ? 'Required prompt…' : 'Optional third prompt…'}
                                    value={p}
                                    onChange={e => updatePrompt(i, e.target.value)}
                                    maxLength={200}
                                />
                            </div>
                        ))}
                        {error && <p className="pg-error">{error}</p>}
                        <button
                            type="submit"
                            className="pg-btn pg-btn--primary"
                            disabled={!canSubmit || submitting}
                            style={{ marginTop: '0.5rem' }}
                        >
                            {submitting ? 'Submitting…' : `Submit ${validPrompts.length} Prompt${validPrompts.length !== 1 ? 's' : ''}`}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
