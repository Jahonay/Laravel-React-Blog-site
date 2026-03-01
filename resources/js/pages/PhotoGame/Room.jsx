import { useEffect, useRef, useState } from 'react';
import LobbyPhase from '../PhotoGame/LobbyPhase';
import PromptsPhase from '../PhotoGame/PromptsPhase';
import PhotosPhase from '../PhotoGame/PhotosPhase';
import VotingPhase from '../PhotoGame/VotingPhase';
import ResultsPhase from '../PhotoGame/ResultsPhase';
import { useParams, Link } from 'react-router-dom';


export default function PhotoGameRoom(/*{ code }*/) {
    const { code } = useParams();
    const [state, setState] = useState(null);
    const [myPlayerId, setMyPlayerId] = useState(null);
    const [isHost, setIsHost] = useState(false);
    const pollRef = useRef(null);

    async function fetchState() {
        try {
            const res = await fetch(`/photo-game/api/${code}/state`);
            if (!res.ok) return;
            const data = await res.json();
            setState(data);
            if (data.player_id) setMyPlayerId(data.player_id);
            if (data.is_host) setIsHost(data.is_host);
        } catch (e) {
            // silent fail — keep polling
        }
    }

    useEffect(() => {
        fetchState();

        // Polling every 2s as fallback (works without Pusher/Reverb setup)
        pollRef.current = setInterval(fetchState, 2000);

        // Attempt real-time via Laravel Echo if configured
        try {
            if (window.Echo) {
                window.Echo.channel(`game-room.${code}`)
                    .listen('.state.changed', () => fetchState());
            }
        } catch (e) { /* Echo not configured */ }

        return () => {
            clearInterval(pollRef.current);
            try {
                if (window.Echo) window.Echo.leaveChannel(`game-room.${code}`);
            } catch (e) { /* ignore */ }
        };
    }, [code]);

    async function apiPost(path, body = {}) {
        const res = await fetch(`/photo-game/api/${code}/${path}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
            },
            body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Request failed');
        await fetchState();
        return data;
    }

    if (!state) {
        return (
            <div style={loadingStyle}>
                <div style={spinnerStyle} />
                <p style={{ color: '#888', fontFamily: 'DM Sans, sans-serif' }}>Connecting…</p>
            </div>
        );
    }

    const sharedProps = { state, myPlayerId, isHost, code, apiPost, refetch: fetchState };

    return (
        <div>
            {state.phase === 'lobby' && <LobbyPhase {...sharedProps} />}
            {state.phase === 'prompts' && <PromptsPhase {...sharedProps} />}
            {state.phase === 'photos' && <PhotosPhase {...sharedProps} />}
            {state.phase === 'voting' && <VotingPhase {...sharedProps} />}
            {state.phase === 'results' && <ResultsPhase {...sharedProps} />}
        </div>
    );
}

const loadingStyle = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0d0d14',
    gap: '1rem',
};

const spinnerStyle = {
    width: 40,
    height: 40,
    border: '3px solid #222',
    borderTop: '3px solid #f9c846',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
};
