import { useState } from 'react';
import { sharedStyles } from './shared';

export default function VotingPhase({ state, myPlayerId, code, apiPost }) {
    const me = state.players?.find(p => p.id === myPlayerId);
    const alreadyVoted = me?.vote_submitted;

    const [selected, setSelected] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const votedCount = state.players?.filter(p => p.vote_submitted).length ?? 0;
    const total = state.players?.length ?? 0;

    // Exclude my own photo from voting
    const photos = state.photos?.filter(ph => !ph.is_mine) ?? [];

    async function handleVote() {
        if (!selected) return;
        setSubmitting(true);
        setError('');
        try {
            await apiPost('vote', { photo_id: selected });
        } catch (err) {
            setError(err.message);
            setSubmitting(false);
        }
    }

    return (
        <div className="pg">
            <style>{sharedStyles}{`
                .pg-photo-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                }

                .pg-vote-card {
                    border: 2px solid #2a2a3a;
                    border-radius: 14px;
                    overflow: hidden;
                    cursor: pointer;
                    transition: border-color 0.2s, transform 0.15s;
                    background: #0d0d14;
                    position: relative;
                }

                .pg-vote-card:hover {
                    transform: translateY(-3px);
                    border-color: #555;
                }

                .pg-vote-card--selected {
                    border-color: #f9c846;
                    box-shadow: 0 0 0 3px rgba(249,200,70,0.15);
                }

                .pg-vote-card img {
                    width: 100%;
                    aspect-ratio: 4/3;
                    object-fit: cover;
                    display: block;
                }

                .pg-vote-card__check {
                    position: absolute;
                    top: 0.5rem;
                    right: 0.5rem;
                    background: #f9c846;
                    color: #0d0d14;
                    border-radius: 50%;
                    width: 28px;
                    height: 28px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 0.85rem;
                    opacity: 0;
                    transition: opacity 0.15s;
                }

                .pg-vote-card--selected .pg-vote-card__check {
                    opacity: 1;
                }
            `}</style>
            <div className="pg__wrap">
                <div className="pg__header">
                    <div className="pg__code-badge">Room <span>{code}</span></div>
                    <div className="pg__phase-label">Voting</div>
                </div>

                <div className="pg-prompt-pill">
                    <div className="pg-prompt-pill__label">🗳️ The Prompt Was</div>
                    <div className="pg-prompt-pill__text">{state.selected_prompt}</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h2 className="pg__title" style={{ margin: 0, fontSize: '1.25rem' }}>
                        {alreadyVoted ? 'Vote cast!' : 'Pick your favorite'}
                    </h2>
                    <span style={{ color: '#555', fontSize: '0.85rem' }}>{votedCount}/{total} voted</span>
                </div>

                {alreadyVoted ? (
                    <div className="pg-waiting">
                        <div className="pg-waiting__spinner" />
                        <p style={{ margin: 0, fontSize: '0.9rem' }}>
                            Waiting for everyone to vote…
                        </p>
                    </div>
                ) : photos.length === 0 ? (
                    <div className="pg-waiting">
                        <p style={{ color: '#555' }}>No photos to vote on (everyone submitted their own?)</p>
                    </div>
                ) : (
                    <>
                        <div className="pg-photo-grid">
                            {photos.map(photo => (
                                <div
                                    key={photo.id}
                                    className={`pg-vote-card${selected === photo.id ? ' pg-vote-card--selected' : ''}`}
                                    onClick={() => setSelected(photo.id)}
                                >
                                    <img src={photo.url} alt="Submission" />
                                    <div className="pg-vote-card__check">✓</div>
                                </div>
                            ))}
                        </div>
                        {error && <p className="pg-error">{error}</p>}
                        <button
                            className="pg-btn pg-btn--primary"
                            disabled={!selected || submitting}
                            onClick={handleVote}
                        >
                            {submitting ? 'Submitting vote…' : selected ? '🗳️ Cast My Vote' : 'Select a photo to vote'}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
