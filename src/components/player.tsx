"use client";

import React, { FC, useEffect, useRef, useState } from "react";
import ReactAudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import "./player.css";

interface Props {
  videoId?: string;
  isOwner?: boolean;
}

const Player: FC<Props> = ({ videoId, isOwner }) => {
  const audioRef = useRef(null);
  const [audioSrc, setAudioSrc] = useState("");

  useEffect(() => {
    if (audioRef?.current && (audioRef.current as HTMLAudioElement)) {
      const audioElement = audioRef.current as unknown as {
        audio: { current: HTMLAudioElement };
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
      // audio.onloadedmetadata = () => {
      //     setDuration(Math.round(audio.duration));
      // };
    }
  }, [videoId, isOwner]);
  return (
    <div className="player-component">
      <ReactAudioPlayer
        ref={audioRef}
        src={audioSrc}
        showJumpControls
        showFilledProgress
        showFilledVolume
        hasDefaultKeyBindings={false}
        // onPlay={onPlay}
        // onPause={() => clearInterval(timerId)}
        // onEnded={onEnded}
      />
    </div>
  );
};

export default Player;
