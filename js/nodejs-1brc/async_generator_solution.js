import fs from 'node:fs';
import path from 'node:path';
import stp from 'node:stream/promises';
import { LF, LF_BYTE, SC_BYTE } from './constants/ascii.constant.js';
import { _KiB } from './constants/information.constant.js';
import { is_main_module } from './utilities/modules.utility.js';

let working_record = undefined;
const record_by_name = new Map();

function create_record() {
  return {
    count: 0,
    total: 0,
    maximum: Number.MIN_VALUE,
    minimum: Number.MAX_VALUE,
    get mean() {
      return this.total / this.count;
    },
  };
}

function set_working_record(name) {
  working_record = record_by_name.get(name);
  const is_new = !working_record;
  if (is_new) {
    working_record = create_record();
    record_by_name.set(name, working_record);
  }
}

function process_measured(temperature) {
  working_record.count += 1;
  working_record.total += temperature;
  working_record.maximum = Math.max(temperature, working_record.maximum);
  working_record.minimum = Math.min(temperature, working_record.minimum);
}

async function process_measurements(input_path) {
  const input_rs = fs.createReadStream(input_path, {
    autoClose: true,
    emitClose: true,
    encoding: undefined,
    end: Infinity,
    fd: undefined,
    flags: 'r',
    fs: undefined,
    highWaterMark: 16 * _KiB,
    mode: 438,
    signal: undefined,
    start: undefined,
  });

  const output_ws = fs.createWriteStream(undefined, {
    fd: process.stdout.fd,
  });

  const beg = performance.now();
  console.profile();
  await stp.pipeline(
    input_rs,
    async function* pluck_line(source) {
      const empty = Buffer.allocUnsafe(0);
      let left_over = empty;
      function concat_with_left_over(chunk) {
        let concated = Buffer.concat([left_over, chunk]);
        left_over = empty;
        return concated;
      }

      let batch_index = 0;
      const batch_size = 256;
      const batch = Array.from({ length: batch_size });
      for await (const next_chunk of source) {
        let read_offset = 0;
        let lf_index = -1;
        let chunk = concat_with_left_over(next_chunk);

        const has_new_line = function has_new_line() {
          lf_index = chunk.indexOf(LF_BYTE, read_offset);
          return lf_index !== -1;
        };

        while (has_new_line()) {
          const is_start_of_chunk = lf_index === 0;
          if (is_start_of_chunk) {
            read_offset += 1;
            continue;
          }

          const row = chunk.subarray(read_offset, lf_index);
          read_offset = lf_index + 1;

          batch[batch_index] = row;
          if (batch_index === batch_size - 1) {
            yield batch;
            batch_index = 0;
          }

          batch_index += 1;
        }

        left_over = chunk.subarray(read_offset);
      }

      yield batch;
    },
    async function* aggregate_line(source) {
      for await (const batch of source) {
        for (const line_bytes of batch) {
          if (!line_bytes) break;
          const sc_index = line_bytes.indexOf(SC_BYTE);
          const name = line_bytes.toString('utf-8', 0, sc_index);
          const temp = parseFloat(line_bytes.toString('utf-8', sc_index + 1));
          set_working_record(name);
          process_measured(temp);
        }
      }
      yield true;
    },
    async function* emit_records_inorder(source) {
      for await (const _ of source) {
        const names = Array.from(record_by_name.keys()).sort();
        for (const name of names) {
          const record = record_by_name.get(name);
          const avg = record.mean.toFixed(2);
          const max = record.maximum.toFixed(2);
          const min = record.minimum.toFixed(2);
          const row = `${name}=${avg}/${max}/${min}${LF}`;
          yield row;
        }
      }
    },
    output_ws,
  );

  console.profileEnd();
  const end = performance.now();
  const seconds_elapsed = (end - beg) / 1000;
  process.stdout.write(`${LF}Took ${seconds_elapsed.toFixed(4)} seconds${LF}`);
}

/**
 * Allowed assumptions:
 * - input file uses utf8 encoding
 * - a station name may contain any character except for '\n' and ';'
 */
if (is_main_module(import.meta)) {
  const input_path = path.resolve('resources', 'measurements', '1_000_000.txt');
  try {
    await process_measurements(input_path);
  } catch (e) {
    console.error('Failed to solve challenge:', e);
    process.exit(1);
  }
}
