import {
  FALSE,
  TO_ONE_AGENT,
  VALUE,
} from '../constants/concurrency.constants.js';

/**
 * @typedef {Int8Array
 *    | Uint8Array
 *    | Int16Array
 *    | Uint16Array
 *    | Int32Array
 *    | Uint32Array
 *  } TypedArray
 */

/**
 * @typedef {number | bigint} Integer
 */

/**
 * @param {TypedArray} mutex
 * @param {Integer} agent_id
 * @returns
 */
export function is_locked(mutex, agent_id) {
  return Atomics.compareExchange(mutex, VALUE, FALSE, agent_id) !== FALSE;
}

/**
 * @param {TypedArray} mutex
 * @param {Integer} agent_id
 * @returns
 */
export function lock(mutex, agent_id) {
  for (;;) {
    const is_locked =
      Atomics.compareExchange(mutex, VALUE, FALSE, agent_id) !== FALSE;

    if (is_locked) {
      Atomics.wait(mutex, VALUE);
    }
  }
}

/**
 * @param {TypedArray} mutex
 * @returns
 */
export function unlock(mutex) {
  Atomics.store(mutex, VALUE, FALSE);
  Atomics.notify(mutex, VALUE, TO_ONE_AGENT);
}
