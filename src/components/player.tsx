'use client';

import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import ReactAudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import './player.css';
import { useSocket } from '@/Context/SocketProvider';
import { FaCircleInfo } from 'react-icons/fa6';

interface Props {
    audioUrl?: string;
    isOwner?: boolean;
    roomId?: string;
    user: {
        id: Number;
        name: string;
        email: string;
        image: string;
    };
}

const Player: FC<Props> = ({ audioUrl, isOwner, roomId, user }) => {
    const audioRef = useRef(null);
    const { socket, isConnected } = useSocket();

    useEffect(() => {
        if (audioRef?.current && (audioRef.current as HTMLAudioElement)) {
            const audioElement = audioRef.current as unknown as {
                audio: { current: HTMLAudioElement };
                handlePause: () => void;
            };
            const audio = audioElement.audio.current as unknown as HTMLAudioElement;
            audio.preload = 'metadata';

            if (!isOwner) {
                const progress = document.querySelector('[role="progressbar"]') as HTMLElement;
                const controls = document.querySelector(
                    '[class="rhap_main-controls"]'
                ) as HTMLElement;
                if (progress) {
                    progress.style.pointerEvents = 'none';
                }
                if (controls) {
                    controls.style.display = 'none';
                }
            }

            if (!isConnected) return;
            if (!socket) return;
            // eslint-disable-next-line
            socket.on('song-paused', (data: any) => {
                audio.pause();
            });
            // eslint-disable-next-line
            socket.on('song-played', (data: any) => {
                audio.play();
            });

            socket.on(
                'song-seeked',
                (data: {
                    clientId: string;
                    seekTime: number;
                    timestamp: number;
                    isPlaying: boolean;
                }) => {
                    const localTimestamp = Date.now();
                    const networkLatency = (localTimestamp - data.timestamp) / 2;
                    const correctedSeekTime = data.seekTime + networkLatency / 1000; // Convert milliseconds to seconds

                    // Update state or perform other actions with the corrected seek time
                    audio.currentTime = correctedSeekTime;
                    if (data.isPlaying) {
                        audio.play();
                    } else {
                        audio.pause();
                    }
                }
            );
            // eslint-disable-next-line
            socket.on('check-current-timestamp', (data: any) => {
                const currentTimeStamp = audio.currentTime;
                const isPlaying = !audio.paused;
                socket.emit('send-current-timestamp', {
                    currentTimeStamp,
                    userId: data.userId,
                    timeStamp: Date.now(),
                    isPlaying
                });
            });

            // eslint-disable-next-line
            socket.on('receive-current-timestamp', (data: any) => {
                const localTimestamp = Date.now();
                const networkLatency = localTimestamp - data.timeStamp;
                const correctedSeekTime = data.currentTimeStamp + networkLatency / 1000;

                audio.currentTime = correctedSeekTime;
                if (data.isPlaying) {
                    audio.play();
                }
            });

            // audio.onloadedmetadata = () => {
            //     setDuration(Math.round(audio.duration));
            // };
        }

        return () => {
            socket?.off('song-paused');
            socket?.off('song-played');
            socket?.off('song-seeked');
            socket?.off('check-current-timestamp');
            socket?.off('receive-current-timestamp');
        };
    }, [isOwner, isConnected, socket]);

    useEffect(() => {
        socket?.emit('get-current-timestamp', { roomId, userId: user.id });
        // eslint-disable-next-line
    }, []);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const playButton = document.querySelector('[aria-label="Play"]') as HTMLButtonElement;
        const forwardButton = document.querySelector('[aria-label="Forward"]') as HTMLButtonElement;
        const rewindButton = document.querySelector('[aria-label="Rewind"]') as HTMLButtonElement;

        if (playButton) {
            playButton.disabled = isLoading;
            playButton.style.color = isLoading ? 'gray' : 'black';
            playButton.style.cursor = isLoading ? 'default' : 'pointer';
        }
        if (forwardButton) {
            forwardButton.disabled = isLoading;
            forwardButton.style.color = isLoading ? 'gray' : 'black';
            forwardButton.style.cursor = isLoading ? 'default' : 'pointer';
        }
        if (rewindButton) {
            rewindButton.disabled = isLoading;
            rewindButton.style.color = isLoading ? 'gray' : 'black';
            rewindButton.style.cursor = isLoading ? 'default' : 'pointer';
        }
    }, [isLoading]);

    useEffect(() => {
        const progressBarShow = document.querySelector(
            '[class="rhap_progress-bar-show-download"]'
        ) as HTMLButtonElement;

        const progressBarIndicator = document.querySelector(
            '[class="rhap_progress-indicator"]'
        ) as HTMLButtonElement;

        const progressBarFilled = document.querySelector(
            '[class="rhap_progress-filled"]'
        ) as HTMLButtonElement;

        const progressBarProgress = document.querySelector(
            '[class="rhap_download-progress"]'
        ) as HTMLButtonElement;

        if (progressBarShow) {
            progressBarShow.style.backgroundColor = isOwner ? 'black' : 'gray';
        }
        if (progressBarIndicator) {
            progressBarIndicator.style.backgroundColor = isOwner ? 'black' : 'gray';
        }
        if (progressBarFilled) {
            progressBarFilled.style.backgroundColor = isOwner ? 'black' : 'gray';
        }
        if (progressBarProgress) {
            progressBarProgress.style.backgroundColor = isOwner ? 'black' : 'gray';
        }
    }, [isOwner]);

    const onPause = useCallback(() => {
        if (!isConnected || !isOwner || !socket) return;

        socket.emit('pause-song', { roomId, clientId: socket.id });
        // eslint-disable-next-line
    }, [socket, isConnected, roomId]);

    const onPlay = useCallback(() => {
        if (!isConnected || !isOwner || !socket) return;

        socket.emit('play-song', { roomId, clientId: socket.id });
        // eslint-disable-next-line
    }, [socket, isConnected, roomId]);

    const onSeek = useCallback(
        // eslint-disable-next-line
        (event: any) => {
            setIsLoading(false);
            if (!isConnected || !isOwner) return;

            const newSeekTime = parseFloat(event?.target?.currentTime);
            const localTimestamp = Date.now();

            // Emit the "seek-song" event with the seek time and timestamp for covering up the network latency
            socket?.emit('seek-song', {
                roomId,
                seekTime: newSeekTime,
                clientId: socket.id,
                timestamp: localTimestamp,
                isPlaying: !event?.target?.paused
            });
        },
        [socket, isConnected, roomId, isOwner]
    );

    return (
        <div className="player-component">
            {audioUrl && (
                <ReactAudioPlayer
                    ref={audioRef}
                    src={audioUrl}
                    // showJumpControls
                    // showFilledProgress
                    // showFilledVolume
                    // hasDefaultKeyBindings={false}
                    onPause={onPause}
                    onPlay={onPlay}
                    // autoPlay={false}
                    // autoPlayAfterSrcChange={false}
                    // onSeeking={() => setIsLoading(true)}
                    onSeeked={onSeek}
                    // onPause={() => clearInterval(timerId)}
                    // onEnded={onEnded}
                />
                // <audio controls>
                //     <source src={audioUrl} type="audio/ogg" />
                //     Your browser does not support the audio element.
                // </audio>
            )}
        </div>
    );
};

export default Player;
