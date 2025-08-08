import { TrackType } from '@shared-types/SharedTypes';

export function formatTime(time: number) {
  const minutes = Math.floor(time / 60);
  const inputSeconds = Math.floor(time % 60);
  const outputSecons = inputSeconds < 10 ? `0${inputSeconds}` : inputSeconds;
  return `${minutes}:${outputSecons}`;
}

export const getTimePanel = (
  currentTime: number,
  totalTime: number | undefined,
) => {
  if (totalTime) {
    return `${formatTime(currentTime)} / ${formatTime(totalTime)}`;
  }
};

export function getUniqueValuesByKey(
  arr: TrackType[],
  key: keyof TrackType,
): string[] {
  // Используем Set для хранения уникальных значений
  const unqueValues = new Set<string>();

  // Проходим по каждому объекту в массиве
  arr.forEach((item) => {
    const value = item[key];

    // Если значение - массив строк
    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v) {
          unqueValues.add(v);
        }
      });
    }
    // если значение - строка
    else if (typeof value === 'string') {
      unqueValues.add(value);
    }
  });

  // Преобразуем Set обратно в массив и возвращаем
  return Array.from(unqueValues);
}
