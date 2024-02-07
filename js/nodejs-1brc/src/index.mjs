import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { fileURLToPath } from "node:url";

/**
 * Take the sum of all the samples of the given set
 * @param {...number} samples Given set of samples
 * @returns {number} Sum of all samples
 */
function take_sum_of(...samples) {
  return samples.reduce((sum, sample) => (sum += sample), 0);
}

/**
 * Take the arithmetic mean of the given set
 * @param {...number} samples Given set of samples
 * @returns {number} Arithmetic mean
 */
function take_mean_of(...samples) {
  const sum = take_sum_of(...samples);
  const n = samples.length;
  return sum / n;
}

/**
 * Take the largest sample within the given set
 * @param {...number} samples Given set of samples
 * @returns {number} Largest sample
 */
function take_maximum_of(...samples) {
  return Math.max(...samples);
}

/**
 * Take the smallest sample within the given set
 * @param {...number} samples Given set of samples
 * @returns {number} Smallest sample
 */
function take_minimum_of(...samples) {
  return Math.min(...samples);
}

/**
 * Check if `o` is null or undefined
 * @param {unknown} o Comparison target
 * @returns {boolean} True if `o` is null or undefined, false otherwise
 */
function is_nil(o) {
  return o === undefined || o === null;
}

class Dictionary extends Map {
  constructor() {
    super();
  }

  get_or_default(key, default_value) {
    if (this.has(key)) {
      return this.get(key);
    } else {
      return default_value;
    }
  }

  compute(key, remapping_function) {
    const current_value = this.get(key);
    const next_value = remapping_function(key, current_value);
    this.set(key, next_value);
    return next_value;
  }
}

const measurements_by_station = new Dictionary();
const summary_by_station = new Dictionary();

async function solve_challenge(input_path) {
  const input_rstream = fs.createReadStream(input_path, {
    encoding: "utf-8",
  });
  const input_line_reader = readline.createInterface({
    input: input_rstream,
    crlfDelay: Infinity,
  });

  for await (const line of input_line_reader) {
    const [station, measurement_str] = line.split(";");
    measurements_by_station.compute(station, (_, measurements) => {
      if (!Array.isArray(measurements)) {
        measurements = [];
      }
      const measurement = parseFloat(measurement_str);
      measurements.push(measurement);
      return measurements;
    });
  }

  for (const [station, measurements] of measurements_by_station) {
    const mean = take_mean_of(measurements).toFixed(1);
    const maximum = take_maximum_of(measurements).toFixed(1);
    const minimum = take_minimum_of(measurements).toFixed(1);
    console.log(`${station}=${minimum}/${mean}/${maximum}`);
  }
}

function is_main_module() {
  const main_module_path = fs.realpathSync(process.argv[1]);
  const current_module_path = fileURLToPath(import.meta.url);
  return main_module_path === current_module_path;
}

if (is_main_module()) {
  const input_path = path.resolve("resources", "measurements", "1_000.txt");

  solve_challenge(input_path).catch((reason) => {
    console.error("Failed to solve challenge:", reason);
  });
}
