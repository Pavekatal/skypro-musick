'use client';

import styles from './track.module.css';
import Link from 'next/link';
import { TrackType } from '@shared-types/SharedTypes';
import { formatTime } from '@utils/helper';
import { useAppDispatch, useAppSelector } from '../../store/store';
import {
  setCurrentPlaylist,
  setCurrentTrack,
  setIsPlay,
} from '../../store/features/trackSlice';
import classNames from 'classnames';

type TrackProp = {
  track: TrackType;
  playlist: TrackType[];
};

export default function Track({ track, playlist }: TrackProp) {
  const dispatch = useAppDispatch();
  const currentTrack = useAppSelector((state) => state.tracks.currentTrack);
  const isPlay = useAppSelector((state) => state.tracks.isPlay);

  const onClickTrack = () => {
    dispatch(setCurrentTrack(track));
    dispatch(setIsPlay(true));
    dispatch(setCurrentPlaylist(playlist));
  };

  return (
    <div className={styles.playlist__item} onClick={onClickTrack}>
      <div className={styles.playlist__track}>
        <div className={styles.track__title}>
          <div className={styles.track__titleImage}>
            {currentTrack?._id === track._id ? (
              <div
                className={classNames(styles.track__playback, {
                  [styles.track__pulse]: isPlay,
                })}
              ></div>
            ) : (
              <svg className={styles.track__titleSvg}>
                <use xlinkHref="/img/icon/sprite.svg#icon-note"></use>
              </svg>
            )}
          </div>
          <div className="track__title-text">
            <Link className={styles.track__titleLink} href="">
              {track.name} <span className={styles.track__titleSpan}></span>
            </Link>
          </div>
        </div>
        <div className={styles.track__author}>
          <Link className={styles.track__authorLink} href="">
            {track.author}
          </Link>
        </div>
        <div className={styles.track__album}>
          <Link className={styles.track__albumLink} href="">
            {track.album}
          </Link>
        </div>
        <div className="track__time">
          <svg className={styles.track__timeSvg}>
            <use xlinkHref="/img/icon/sprite.svg#icon-like"></use>
          </svg>
          <span className={styles.track__timeText}>
            {formatTime(track.duration_in_seconds)}
          </span>
        </div>
      </div>
    </div>
  );
}
