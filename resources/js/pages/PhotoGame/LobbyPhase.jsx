import { sharedStyles } from './shared';

export default function LobbyPhase({ state, myPlayerId, isHost, code, apiPost }) {
    const playerCount = state.players?.length ?? 0;

    async function handleStart() {
        try {
            await apiPost('start');
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
            <style>{sharedStyles}</style>
            <div className="pg__wrap">
                <div className="pg__header">
                    <div className="pg__code-badge">
                        Room Code <span>{code}</span>
                    </div>
                    <div className="pg__phase-label">Lobby</div>
                </div>

                <h1 className="pg__title">Waiting for players…</h1>
                <p className="pg__subtitle">Share the code above so friends can join!</p>

                <div className="pg-players">
                    {state.players?.map(p => (
                        <div
                            key={p.id}
                            className={`pg-player${p.id === myPlayerId ? ' pg-player--done' : ''}`}
                        >
                            <div className="pg-player__dot" style={{ background: p.id === myPlayerId ? '#f9c846' : '#333' }} />
                            <span className="pg-player__name">{p.name}</span>
                            {p.is_host && <span className="pg-player__crown">👑</span>}
                        </div>
                    ))}
                </div>

                <div className="pg-card">
                    <p style={{ margin: '0 0 0.25rem', fontSize: '0.85rem', color: '#888' }}>How to play</p>
                    <ol style={{ margin: 0, paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        <li style={{ fontSize: '0.875rem', color: '#c0bdb5' }}>Everyone writes 2–3 photo prompts</li>
                        <li style={{ fontSize: '0.875rem', color: '#c0bdb5' }}>One prompt is randomly selected</li>
                        <li style={{ fontSize: '0.875rem', color: '#c0bdb5' }}>Everyone submits a photo matching the prompt</li>
                        <li style={{ fontSize: '0.875rem', color: '#c0bdb5' }}>Vote for the best photo — winner announced!</li>
                    </ol>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                    {isHost && (
                        <button
                            className="pg-btn pg-btn--primary"
                            onClick={handleStart}
                            disabled={playerCount < 2}
                        >
                            {playerCount < 2
                                ? `Waiting for more players (${playerCount}/2+)`
                                : `Start Game with ${playerCount} Players`}
                        </button>
                    )}
                    {!isHost && (
                        <p style={{ textAlign: 'center', color: '#555', fontSize: '0.875rem' }}>
                            Waiting for the host to start the game…
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
