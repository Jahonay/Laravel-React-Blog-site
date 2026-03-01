import { sharedStyles } from './shared';

export default function ResultsPhase({ state, myPlayerId, isHost, code, apiPost }) {
    const photos = [...(state.photos ?? [])].sort((a, b) => b.votes - a.votes);
    const winner = photos[0];
    const myPhoto = photos.find(ph => ph.is_mine);
    const iWon = myPhoto && myPhoto.id === winner?.id;
    const total = state.players?.length ?? 0;

    async function handlePlayAgain() {
        try {
            await apiPost('reset');
        } catch (e) {
            alert(e.message);
        }
    }

    async function handleLeave() {
        await fetch(`/photo-game/api/${code}/leave`, {
            method: 'POST',
            headers: { 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content },
        });
        window.location.href = '/photo-game';
    }

    return (
        <div className="pg">
            <style>{sharedStyles}{`
                .pg-results-winner {
                    text-align: center;
                    margin-bottom: 2rem;
                }

                .pg-results-winner__crown {
                    font-size: 3rem;
                    line-height: 1;
                    margin-bottom: 0.5rem;
                    animation: bounce 0.6s ease infinite alternate;
                }

                @keyframes bounce {
                    from { transform: translateY(0); }
                    to { transform: translateY(-8px); }
                }

                .pg-results-winner__name {
                    font-family: 'Syne', sans-serif;
                    font-size: 2rem;
                    font-weight: 800;
                    background: linear-gradient(135deg, #f9c846, #ff6b6b);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .pg-results-winner__votes {
                    color: #888;
                    font-size: 0.9rem;
                    margin-top: 0.25rem;
                }

                .pg-results-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                }

                .pg-results-card {
                    border-radius: 14px;
                    overflow: hidden;
                    position: relative;
                    border: 2px solid #2a2a3a;
                }

                .pg-results-card--winner {
                    border-color: #f9c846;
                    box-shadow: 0 0 0 3px rgba(249,200,70,0.2);
                }

                .pg-results-card img {
                    width: 100%;
                    aspect-ratio: 4/3;
                    object-fit: cover;
                    display: block;
                }

                .pg-results-card__footer {
                    background: #141420;
                    padding: 0.6rem 0.75rem;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .pg-results-card__player {
                    font-size: 0.8rem;
                    color: #c0bdb5;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .pg-results-card__votes {
                    font-size: 0.8rem;
                    font-weight: 700;
                    color: #f9c846;
                    white-space: nowrap;
                    margin-left: 0.5rem;
                }

                .pg-results-card__badge {
                    position: absolute;
                    top: 0.5rem;
                    left: 0.5rem;
                    background: #f9c846;
                    color: #0d0d14;
                    font-size: 0.7rem;
                    font-weight: 700;
                    padding: 0.2rem 0.5rem;
                    border-radius: 999px;
                }
            `}</style>
            <div className="pg__wrap">
                <div className="pg__header">
                    <div className="pg__code-badge">Room <span>{code}</span></div>
                    <div className="pg__phase-label">Results</div>
                </div>

                <div className="pg-prompt-pill" style={{ marginBottom: '1.5rem' }}>
                    <div className="pg-prompt-pill__label">📸 The Prompt Was</div>
                    <div className="pg-prompt-pill__text">{state.selected_prompt}</div>
                </div>

                {winner && (
                    <div className="pg-results-winner">
                        <div className="pg-results-winner__crown">{iWon ? '🏆' : '🥇'}</div>
                        <div className="pg-results-winner__name">
                            {iWon ? 'You Win!' : `${winner.player_name} Wins!`}
                        </div>
                        <div className="pg-results-winner__votes">
                            {winner.votes} vote{winner.votes !== 1 ? 's' : ''} out of {total - 1} possible
                        </div>
                    </div>
                )}

                <div className="pg-results-grid">
                    {photos.map((photo, idx) => (
                        <div
                            key={photo.id}
                            className={`pg-results-card${idx === 0 ? ' pg-results-card--winner' : ''}`}
                        >
                            {idx === 0 && <div className="pg-results-card__badge">👑 Winner</div>}
                            <img src={photo.url} alt={photo.player_name} />
                            <div className="pg-results-card__footer">
                                <span className="pg-results-card__player">{photo.player_name}</span>
                                <span className="pg-results-card__votes">
                                    {photo.votes} {photo.votes === 1 ? 'vote' : 'votes'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {isHost && (
                        <button className="pg-btn pg-btn--primary" onClick={handlePlayAgain}>
                            🔄 Play Again
                        </button>
                    )}
                    {!isHost && (
                        <p style={{ textAlign: 'center', color: '#555', fontSize: '0.875rem' }}>
                            Waiting for the host to start a new round…
                        </p>
                    )}
                    <button className="pg-btn pg-btn--ghost" onClick={handleLeave}>
                        Leave Room
                    </button>
                </div>
            </div>
        </div>
    );
}
