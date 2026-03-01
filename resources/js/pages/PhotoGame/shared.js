// Shared CSS string injected into each phase component
// Import as: import { sharedStyles, GameLayout, PhaseTitle } from './shared';

export const sharedStyles = `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');

* { box-sizing: border-box; }

.pg {
    min-height: 100vh;
    background: #0d0d14;
    color: #f0eee8;
    font-family: 'DM Sans', sans-serif;
    padding: 2rem 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.pg__wrap {
    width: 100%;
    max-width: 680px;
}

.pg__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2rem;
}

.pg__code-badge {
    font-family: 'Syne', sans-serif;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #555;
    background: #141420;
    border: 1px solid #222;
    padding: 0.4rem 0.75rem;
    border-radius: 999px;
}

.pg__code-badge span {
    color: #f9c846;
    margin-left: 0.4rem;
}

.pg__phase-label {
    font-family: 'Syne', sans-serif;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #ff6b6b;
    background: rgba(255,107,107,0.1);
    border: 1px solid rgba(255,107,107,0.2);
    padding: 0.4rem 0.75rem;
    border-radius: 999px;
}

.pg__title {
    font-family: 'Syne', sans-serif;
    font-size: 2rem;
    font-weight: 800;
    margin: 0 0 0.5rem;
    line-height: 1.1;
}

.pg__subtitle {
    color: #888;
    font-size: 0.9rem;
    margin: 0 0 1.5rem;
}

.pg-card {
    background: #141420;
    border: 1px solid #222;
    border-radius: 16px;
    padding: 1.5rem;
    margin-bottom: 1rem;
}

.pg-players {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    gap: 0.75rem;
    margin-bottom: 1.5rem;
}

.pg-player {
    background: #1a1a28;
    border: 1px solid #2a2a3a;
    border-radius: 12px;
    padding: 0.75rem 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
}

.pg-player--done {
    border-color: #2a4a2a;
    background: #141e14;
}

.pg-player__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #333;
    flex-shrink: 0;
}

.pg-player--done .pg-player__dot {
    background: #4caf50;
}

.pg-player__name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #c0bdb5;
}

.pg-player__crown {
    font-size: 0.7rem;
    margin-left: auto;
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
}

.pg-input:focus {
    border-color: #f9c846;
}

.pg-btn {
    padding: 0.85rem 1.5rem;
    border-radius: 12px;
    border: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: transform 0.15s, opacity 0.15s, box-shadow 0.15s;
    width: 100%;
}

.pg-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.3);
}

.pg-btn:disabled {
    opacity: 0.45;
    cursor: not-allowed;
}

.pg-btn--primary {
    background: linear-gradient(135deg, #f9c846, #ff6b6b);
    color: #0d0d14;
    font-weight: 700;
}

.pg-btn--ghost {
    background: transparent;
    color: #888;
    border: 1px solid #333;
}

.pg-btn--danger {
    background: rgba(255,107,107,0.15);
    color: #ff6b6b;
    border: 1px solid rgba(255,107,107,0.3);
}

.pg-error {
    color: #ff6b6b;
    font-size: 0.875rem;
    margin: 0.5rem 0 0;
}

.pg-prompt-pill {
    background: linear-gradient(135deg, rgba(249,200,70,0.1), rgba(255,107,107,0.1));
    border: 1px solid rgba(249,200,70,0.25);
    border-radius: 12px;
    padding: 1.25rem 1.5rem;
    margin-bottom: 1.5rem;
    text-align: center;
}

.pg-prompt-pill__label {
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #f9c846;
    margin-bottom: 0.5rem;
}

.pg-prompt-pill__text {
    font-family: 'Syne', sans-serif;
    font-size: 1.4rem;
    font-weight: 700;
    line-height: 1.2;
    color: #f0eee8;
}

.pg-waiting {
    text-align: center;
    padding: 2rem;
    color: #555;
}

.pg-waiting__spinner {
    width: 32px;
    height: 32px;
    border: 2px solid #222;
    border-top-color: #f9c846;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: 0 auto 1rem;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}
`;
