'use client';

import Link from 'next/link';
import styles from './bar.module.css';
import stylesImport from '../track-card/track.module.css';
import classnames from 'classnames';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { useEffect, useRef, useState } from 'react';
import {
  setCurrentTime,
  setIsPlay,
  setIsShuffle,
  setNextTrack,
  setPrevTrack,
} from '../../store/features/trackSlice';
import { getTimePanel } from '@utils/helper';
import ProgressBar from '@components/progress-bar/ProgressBar';

export default function Bar() {
  const currentTrack = useAppSelector((state) => state.tracks.currentTrack);
  const isPlay = useAppSelector((state) => state.tracks.isPlay);
  const currentTime = useAppSelector((state) => state.tracks.currentTime);
  const isShuffle = useAppSelector((state) => state.tracks.isShuffle);
  const dispatch = useAppDispatch();

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isLoop, setIsLoop] = useState(false);
  const [isLoadedTrack, setIsLoadedTrack] = useState(false);
  const [volumeTrack, setVolumeTrack] = useState(20);

  useEffect(() => {
    setIsLoadedTrack(false);
    if (currentTrack && isPlay && audioRef.current) {
      audioRef.current.volume = volumeTrack / 100;
      audioRef.current.play();
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [currentTrack, isPlay, volumeTrack]);

  if (!currentTrack) return <></>;

  const onTogglePlay = () => {
    if (isPlay) {
      audioRef.current?.pause();
      dispatch(setIsPlay(false));
    } else {
      audioRef.current?.play();
      dispatch(setIsPlay(true));
    }
  };

  const onTimeUpdate = () => {
    if (audioRef.current) {
      dispatch(setCurrentTime(audioRef.current.currentTime));
    }
  };

  const onChangeProgress = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const progressTime = +e.target.value;
      audioRef.current.currentTime = progressTime;
    }
  };

  const onLoadedTrack = () => {
    if (audioRef.current) {
      setIsLoadedTrack(true);
      audioRef.current.play();
      dispatch(setIsPlay(true));
    }
  };

  const onChangeVolumeTrack = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentVolume = +e.target.value;
    setVolumeTrack(currentVolume);
    if (audioRef.current) {
      audioRef.current.volume = currentVolume / 100;
    }
  };

  const onNextTrack = () => {
    dispatch(setNextTrack());
  };

  const onPrevTrack = () => {
    dispatch(setPrevTrack());
  };

  const onToggleLoop = () => {
    setIsLoop(!isLoop);
  };

  const onToggleShuffle = () => {
    dispatch(setIsShuffle());
  };

  const endedTrack = () => {
    dispatch(setNextTrack());
  };

  const notYetImplemented = () => {
    alert('Еще не реализовано');
  };

  return (
    <div className={styles.bar}>
      <audio
        ref={audioRef}
        controls
        src={currentTrack?.track_file}
        className={styles.audio}
        loop={isLoop}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedTrack}
        onEnded={endedTrack}
      ></audio>
      <div className={styles.bar__playerPanelProgress}>
        <span className={stylesImport.track__timeText}>
          {getTimePanel(currentTime, audioRef.current?.duration)}
        </span>
      </div>
      <div className={styles.bar__content}>
        <ProgressBar
          max={audioRef.current?.duration || 0}
          step={0.01}
          readOnly={!isLoadedTrack}
          value={currentTime}
          onChange={onChangeProgress}
        />
        <div className={styles.bar__playerBlock}>
          <div className={styles.bar__player}>
            <div className={styles.player__controls}>
              <div className={styles.player__btnPrev} onClick={onPrevTrack}>
                <svg className={styles.player__btnPrevSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-prev"></use>
                </svg>
              </div>

              <div
                className={classnames(styles.player__btnPlay, styles.btn)}
                onClick={onTogglePlay}
              >
                <svg className={styles.player__btnPlaySvg}>
                  <use
                    xlinkHref={`/img/icon/sprite.svg#icon-${isPlay ? 'pause' : 'play'}`}
                  ></use>
                </svg>
              </div>

              <div className={styles.player__btnNext} onClick={onNextTrack}>
                <svg className={styles.player__btnNextSvg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-next"></use>
                </svg>
              </div>

              <div
                className={classnames(styles.player__btnRepeat, styles.btnIcon)}
                onClick={onToggleLoop}
              >
                <svg
                  className={classnames(styles.player__btnRepeatSvg, {
                    [styles.activeSvg]: isLoop,
                  })}
                >
                  <use xlinkHref="/img/icon/sprite.svg#icon-repeat"></use>
                </svg>
              </div>

              <div
                className={classnames(
                  styles.player__btnShuffle,
                  styles.btnIcon,
                )}
                onClick={onToggleShuffle}
              >
                <svg
                  className={classnames(styles.player__btnShuffleSvg, {
                    [styles.activeSvg]: isShuffle,
                  })}
                >
                  <use xlinkHref="/img/icon/sprite.svg#icon-shuffle"></use>
                </svg>
              </div>
            </div>

            <div className={styles.player__trackPlay}>
              <div className={styles.trackPlay__contain}>
                <div className={styles.trackPlay__image}>
                  <svg className={styles.trackPlay__svg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-note"></use>
                  </svg>
                </div>
                <div className={styles.trackPlay__author}>
                  <Link className={styles.trackPlay__authorLink} href="">
                    {currentTrack.name}
                  </Link>
                </div>
                <div className={styles.trackPlay__album}>
                  <Link className={styles.trackPlay__albumLink} href="">
                    {currentTrack.author}
                  </Link>
                </div>
              </div>

              <div className={styles.trackPlay__dislike}>
                <div
                  className={classnames(
                    styles.player__btnShuffle,
                    styles.btnIcon,
                  )}
                  onClick={notYetImplemented}
                >
                  <svg className={styles.trackPlay__likeSvg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-like"></use>
                  </svg>
                </div>
                {/* <div
                  className={classnames(
                    styles.trackPlay__dislike,
                    styles.btnIcon,
                  )}
                >
                  <svg className={styles.trackPlay__dislikeSvg}>
                    <use xlinkHref="/img/icon/sprite.svg#icon-dislike"></use>
                  </svg>
                </div> */}
              </div>
            </div>
          </div>
          <div className={styles.bar__volumeBlock}>
            <div className={styles.volume__content}>
              <div className={styles.volume__image}>
                <svg className={styles.volume__svg}>
                  <use xlinkHref="/img/icon/sprite.svg#icon-volume"></use>
                </svg>
              </div>
              <div className={classnames(styles.volume__progress, styles.btn)}>
                <input
                  className={classnames(
                    styles.volume__progressLine,
                    styles.btn,
                  )}
                  type="range"
                  name="range"
                  min={0}
                  max={100}
                  step={0.01}
                  value={volumeTrack}
                  onChange={onChangeVolumeTrack}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
