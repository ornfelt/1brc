/**
 * @typedef {Record} Parser.Record
 */

import { LF_BYTE } from './constants/ascii.constant.js';
import { EMPTY_BUFFER } from './constants/buffer.constants.js';

/**
 * Measurements summary record
 */
export class Record {
  /**
   * @type {number} Indicates the number of measurements
   */
  #count;

  /**
   * @type {number} Indicates the sum of all measurements
   */
  #total;

  /**
   * @type {number} Indicates the highest temperature measured
   */
  maximum;

  /**
   * @type {number} Indicates the lowest temperature measured
   */
  minimum;

  /**
   * @type {number} Indicates the mean across measurements
   */
  get mean() {
    return this.#total / this.#count;
  }

  constructor() {
    this.#count = 0;
    this.#total = 0;
    this.maximum = Number.MIN_VALUE;
    this.minimum = Number.MAX_VALUE;
  }

  /**
   * @param {number} temperature
   */
  process(temperature) {
    this.#count += 1;
    this.#total += temperature;
    this.maximum = Math.max(temperature, this.maximum);
    this.minimum = Math.min(temperature, this.minimum);
  }

  /**
   * @returns {string} "minimum/mean/maximum"
   */
  toString() {
    const mean = this.mean.toFixed(1);
    const minimum = this.minimum.toFixed(1);
    const maximum = this.maximum.toFixed(1);
    return `${minimum}/${mean}/${maximum}`;
  }
}

/**
 * Parser's batch
 *
 * this batch does not perform bounds checking
 */
class Batch {
  #container;
  #position;
  #size;

  /**
   * Create a batch of the given `size`
   * @param {number} size
   */
  constructor(size) {
    this.#size = size;
    this.#position = 0;
    this.#container = Array.from({ length: this.#size });
  }

  get iter() {
    return this.#container[Symbol.iterator];
  }

  get is_full() {
    return this.#position + 1 >= this.#size;
  }

  push(item) {
    this.#container[this.#position] = item;
    this.#position += 1;
  }

  clear() {
    this.#container.fill(undefined);
    this.#position = 0;
  }
}

/**
 * Parser for the 1BRC challenge file
 */
export class Parser {
  /**
   * @type {Map<string, Record>}
   */
  record_by_name;

  /**
   * @type {number}
   */
  static #BATCH_SIZE = 256;

  /**
   * @type {Batch}
   */
  #batch;

  /**
   * @type {string}
   */
  #file_name;

  /**
   * @type {number}
   */
  #read_offset;

  /**
   * @type {Buffer}
   */
  #leftover;

  /**
   * Create a parser for `file_name`
   * @param {string} file_name
   */
  constructor(file_name) {
    this.record_by_name = new Map();
    this.#file_name = file_name;
    this.#leftover = EMPTY_BUFFER;
    this.#batch = new Batch(Parser.#BATCH_SIZE);
  }

  /**
   * @param {Generator<Buffer>} source
   * @returns {number} Number of bytes read
   */
  parse(source) {
    for (const chunk of source) {
      const line_chunk = this.#prepend_leftover(chunk);
      const start = line_chunk.indexOf(LF_BYTE)
    }
    this.#reset();
  }

  /**
   * @param {Buffer} chunk
   * @returns {Buffer} Chunk with leftover preprended
   */
  #prepend_leftover(chunk) {
    const ret = Buffer.concat([this.#leftover, chunk]);
    this.#leftover = EMPTY_BUFFER;
    return ret;
  }

  #reset() {
    this.#leftover = EMPTY_BUFFER;
    this.#read_offset = 0;
  }
}
