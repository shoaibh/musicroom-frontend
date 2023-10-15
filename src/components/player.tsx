"use client";

import React, { FC, useEffect, useRef, useState } from "react";
import ReactAudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import "./player.css";

interface Props {
  videoId?: string;
}

const Player: FC<Props> = ({ videoId }) => {
  const audioRef = useRef(null);
  const [audioSrc, setAudioSrc] = useState("");

  console.log("==", { videoId });

  useEffect(() => {
    // let audio = audioRef.current.audio.current;
    // audio.preload = "metadata";
    // console.log(videoId)
    if (videoId)
      setAudioSrc(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/song/play?videoId=${videoId}`
      );
    // audio.onloadedmetadata = () => {
    //     setDuration(Math.round(audio.duration));
    // };
  }, [videoId]);
  return (
    <div className="player-component">
      <ReactAudioPlayer
        ref={audioRef}
        src={audioSrc}
        // onPlay={onPlay}
        // onPause={() => clearInterval(timerId)}
        // onEnded={onEnded}
      />
    </div>
  );
};

export default Player;
