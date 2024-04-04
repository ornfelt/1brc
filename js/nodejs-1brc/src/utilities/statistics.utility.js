/**
 * Take the sum of all the samples of the given set
 * @param {number[]} samples Given set of samples
 * @returns {number} Sum of all samples
 */
export function take_sum_of(samples) {
  return samples.reduce((sum, sample) => (sum += sample), 0);
}

/**
 * Take the arithmetic mean of the given set
 * @param {number[]} samples Given set of samples
 * @param {{ sum?: number }?} conf Configuration
 * @returns {number} Arithmetic mean
 */
export function take_mean_of(samples, conf) {
  const sum = conf?.sum ?? take_sum_of(samples);
  const n = samples.length;
  if (n === 0) {
    return NaN;
  } else {
    return sum / n;
  }
}

/**
 * Take the minimum and maximum sample of the given set
 * @param {number[]} samples Given set of samples
 * @param {{ is_ascending?: boolean, is_descending?: boolean }?} conf Configuration
 * @returns {{ maximum: number, minimum: number }} Extremes
 */
export function take_extremes_of(samples, conf) {
  if (!samples.length) {
    return {
      maximum: NaN,
      minimum: NaN,
    };
  }

  if (conf?.is_ascending) {
    return {
      maximum: samples.at(-1),
      minimum: samples.at(0),
    };
  }

  if (conf?.is_descending) {
    return {
      maximum: samples.at(0),
      minimum: samples.at(-1),
    };
  }

  const as_ascending = (f, s) => f - s;
  const sorted = samples.toSorted(as_ascending);
  return {
    maximum: sorted.at(-1),
    minimum: sorted.at(0),
  };
}

/**
 * Take the largest sample within the given set
 * @param {number[]} samples Given set of samples
 * @param {{ is_ascending?: boolean, is_descending?: boolean }?} conf Configuration
 * @returns {number} Largest sample
 */
export function take_maximum_of(samples, conf) {
  return take_extremes_of(samples, conf).maximum;
}

/**
 * Take the smallest sample within the given set
 * @param {number[]} samples Given set of samples
 * @param {{ is_ascending?: boolean, is_descending?: boolean }?} conf Configuration
 * @returns {number} Smallest sample
 */
export function take_minimum_of(samples, conf) {
  return take_extremes_of(samples, conf).minimum;
}
