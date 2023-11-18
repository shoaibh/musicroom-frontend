"use client";

import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import ReactAudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import "./player.css";
import { useSocket } from "@/Context/SocketProvider";

interface Props {
  videoId?: string;
  isOwner?: boolean;
  roomId?: string;
}

const Player: FC<Props> = ({ videoId, isOwner, roomId }) => {
  const audioRef = useRef(null);
  const [audioSrc, setAudioSrc] = useState("");
  const clientIdRef = useRef<string | null>(null);
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (audioRef?.current && (audioRef.current as HTMLAudioElement)) {
      const audioElement = audioRef.current as unknown as {
        audio: { current: HTMLAudioElement };
        handlePause: () => void;
      };
      let audio = audioElement.audio.current as unknown as HTMLAudioElement;
      audio.preload = "metadata";

      if (!isOwner) {
        const progress = document.querySelector(
          '[role="progressbar"]'
        ) as HTMLElement;
        const controls = document.querySelector(
          '[class="rhap_main-controls"]'
        ) as HTMLElement;
        if (progress) {
          progress.style.pointerEvents = "none";
        }
        if (controls) {
          controls.style.display = "none";
        }
      }

      if (videoId)
        setAudioSrc(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/song/play?videoId=${videoId}`
        );

      if (!isConnected) return;

      socket.on("song-paused", (data: any) => {
        clientIdRef.current = data;
        audio.pause();
      });

      socket.on("song-played", (data: any) => {
        clientIdRef.current = data;
        audio.play();
      });

      socket.on(
        "song-seeked",
        (data: { clientId: string; seekTime: number; timestamp: number }) => {
          clientIdRef.current = data.clientId;

          const localTimestamp = Date.now();
          const networkLatency = (localTimestamp - data.timestamp) / 2;
          const correctedSeekTime = data.seekTime + networkLatency / 1000; // Convert milliseconds to seconds
          console.log("seeked", { correctedSeekTime });

          // Update state or perform other actions with the corrected seek time
          audio.currentTime = correctedSeekTime;
        }
      );

      // audio.onloadedmetadata = () => {
      //     setDuration(Math.round(audio.duration));
      // };
    }

    return () => {
      socket.off("song-paused");
      socket.off("song-played");
      socket.off("song-seeked");
    };
  }, [videoId, isOwner, isConnected, socket]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const playButton = document.querySelector(
      '[aria-label="Play"]'
    ) as HTMLButtonElement;
    const forwardButton = document.querySelector(
      '[aria-label="Forward"]'
    ) as HTMLButtonElement;
    const rewindButton = document.querySelector(
      '[aria-label="Rewind"]'
    ) as HTMLButtonElement;

    if (playButton) {
      playButton.disabled = isLoading;
      playButton.style.color = isLoading ? "gray" : "black";
      playButton.style.cursor = isLoading ? "default" : "pointer";
    }
    if (forwardButton) {
      forwardButton.disabled = isLoading;
      forwardButton.style.color = isLoading ? "gray" : "black";
      forwardButton.style.cursor = isLoading ? "default" : "pointer";
    }
    if (rewindButton) {
      rewindButton.disabled = isLoading;
      rewindButton.style.color = isLoading ? "gray" : "black";
      rewindButton.style.cursor = isLoading ? "default" : "pointer";
    }
  }, [isLoading]);

  const onPause = useCallback(() => {
    if (!isConnected) return;

    if (clientIdRef && clientIdRef.current && clientIdRef.current !== socket.id)
      return;

    socket.emit("pause-song", { roomId, clientId: socket.id });
  }, [socket, isConnected, roomId, clientIdRef]);

  const onPlay = useCallback(() => {
    if (!isConnected) return;

    if (clientIdRef && clientIdRef.current && clientIdRef.current !== socket.id)
      return;

    socket.emit("play-song", { roomId, clientId: socket.id });
  }, [socket, isConnected, roomId, clientIdRef]);

  const onSeek = useCallback(
    (event: any) => {
      setIsLoading(false);
      if (!isConnected) return;

      if (
        clientIdRef &&
        clientIdRef.current &&
        clientIdRef.current !== socket.id
      )
        return;

      const newSeekTime = parseFloat(event?.target?.currentTime);
      const localTimestamp = Date.now();

      // Emit the "seek-song" event with the seek time and timestamp
      socket.emit("seek-song", {
        roomId,
        seekTime: newSeekTime,
        clientId: socket.id,
        timestamp: localTimestamp,
      });
    },
    [socket, isConnected, roomId, clientIdRef, audioRef]
  );

  return (
    <div className="player-component">
      <ReactAudioPlayer
        ref={audioRef}
        src={audioSrc}
        showJumpControls
        showFilledProgress
        showFilledVolume
        hasDefaultKeyBindings={false}
        onPause={onPause}
        onPlay={onPlay}
        autoPlay={false}
        autoPlayAfterSrcChange={false}
        onSeeking={() => setIsLoading(true)}
        onSeeked={onSeek}
        // onPause={() => clearInterval(timerId)}
        // onEnded={onEnded}
      />
    </div>
  );
};

export default Player;
