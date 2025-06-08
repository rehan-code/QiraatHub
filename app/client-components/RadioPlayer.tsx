'use client';

import React, { useState, useRef } from 'react';
import styles from './RadioPlayer.module.css';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

interface RadioPlayerProps {
  streamUrl: string;
  stationName?: string;
}

const RadioPlayer: React.FC<RadioPlayerProps> = ({ streamUrl, stationName = 'Live Radio' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.75);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.src = streamUrl; // Ensure src is set before play
        audioRef.current.load(); // Load the stream
        audioRef.current.play().catch(error => console.error("Error playing audio:", error));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setIsMuted(false); // Unmute if volume is changed manually
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className={styles.radioPlayerContainer}>
      <audio ref={audioRef} preload="none" />
      <div className={styles.controls}>
        <button onClick={togglePlayPause} className={styles.controlButton} aria-label={isPlaying ? 'Pause' : 'Play'}>
          {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
        </button>
        <div className={styles.stationInfo}>
          <p className={styles.stationName}>{stationName}</p>
          {isPlaying && <p className={styles.status}>Now Playing</p>}
          {!isPlaying && <p className={styles.status}>Paused</p>}
        </div>
        <div className={styles.volumeControlContainer}>
          <button onClick={toggleMute} className={styles.controlButton} aria-label={isMuted ? 'Unmute' : 'Mute'}>
            {isMuted || volume === 0 ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className={styles.volumeSlider}
            aria-label="Volume"
          />
        </div>
      </div>
    </div>
  );
};

export default RadioPlayer;
