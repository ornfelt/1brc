import fs from 'node:fs';
import fsp from 'node:fs/promises';
import wt from 'node:worker_threads';
import { LF_BYTE, SC_BYTE } from './constants/ascii.constant.js';
import {
  FALSE,
  TO_EVERY_AGENT,
  TO_ONE_AGENT,
  TRUE,
  VALUE,
} from './constants/concurrency.constants.js';
import { Record } from './parser.js';

if (wt.isMainThread) {
  throw new Error('Expected to run in a worker thread');
}

const { atomic_input_position, is_updating_input_position, input_path } =
  wt.workerData;

/**
 * @type {fsp.FileHandle}
 */
let input_handle = await fsp.open(input_path);

/**
 * @type {import('node:fs').Stats}
 */
let input_stat = await input_handle.stat();

/**
 * @type {number}
 */
let input_position;

/**
 * @type {fsp.FileReadResult}
 */
let input_read;

const record_by_name = new Map();

function has_unread_bytes() {
  return input_position + 1 !== input_stat.size;
}

wt.parentPort.on('message', async ({ input_paths, chunk_size }) => {
  // TODO: Change to allocUnsafe but remember to handle boundaries
  const chunk = Buffer.alloc(chunk_size, 0, 'utf-8');

  try {
    while (has_unread_bytes()) {
      for (;;) {
        process.stdout.write(`${wt.threadId} Comparing...\n`);
        const is_locked =
          Atomics.compareExchange(
            is_updating_input_position,
            VALUE,
            FALSE,
            wt.threadId,
          ) !== FALSE;

        if (is_locked) {
          process.stdout.write(`${wt.threadId} Waiting...\n`);
          Atomics.wait(is_updating_input_position, VALUE);
        } else {
          break;
        }
      }

      process.stdout.write(`${wt.threadId} Entered critical section\n`);
      input_position = Number(Atomics.load(atomic_input_position, VALUE));
      input_read = await input_handle.read(
        chunk,
        0,
        chunk.length,
        input_position,
      );

      const is_end_of_file = input_read.bytesRead === 0;
      if (is_end_of_file) {
        process.stdout.write(`${wt.threadId} Found EOF\n`);
        process.stdout.write(`${wt.threadId} Exited critical section\n`);
        Atomics.store(is_updating_input_position, VALUE, FALSE);
        Atomics.notify(is_updating_input_position, VALUE, TO_EVERY_AGENT);
        // wt.parentPort.postMessage({ type: 'done' });
        // wt.parentPort.close();
        // REMINDER: Exiting just because a worker got to the EOF
        // does NOT mean that workers have finished
        // remember that this critical section is only ONE part
        // of a worker's job, it still has to aggregate the chunk's rows
        return;
      }

      const end_of_parseable = chunk.lastIndexOf(LF_BYTE);
      const is_unparseable_chunk = end_of_parseable === -1;
      if (is_unparseable_chunk) {
        process.stdout.write(`${wt.threadId} Found unparseable chunk\n`);
        process.stdout.write(`${wt.threadId} Exited critical section\n`);
        Atomics.store(is_updating_input_position, VALUE, FALSE);
        Atomics.notify(is_updating_input_position, VALUE, TO_EVERY_AGENT);
        console.error(`[${wt.threadId}] ERR_UNPARSEABLE_CHUNK`);
        wt.parentPort.close();
        return;
      }

      process.stdout.write(`${wt.threadId} Exited critical section\n`);
      const parseable_chunk_size = Math.min(
        end_of_parseable + 1,
        input_read.bytesRead,
      );
      const next_input_position = input_position + parseable_chunk_size;
      Atomics.store(atomic_input_position, VALUE, BigInt(next_input_position));

      Atomics.store(is_updating_input_position, VALUE, FALSE);
      Atomics.notify(is_updating_input_position, VALUE, TO_ONE_AGENT);

      wt.parentPort.postMessage({
        type: 'range',
        value: {
          i0: input_position,
          i1: next_input_position - 1,
          id: wt.threadId.toString(10).padStart(2, '0'),
        },
      });

      // TODO: I should call Record::toString() in main thread
      // to "join" all threads
      const entries = parse_input_chunk({ chunk, record_by_name });
      wt.parentPort.postMessage({
        type: 'record',
        value: entries.map(([name, record]) => [name, record.toString()]),
      });

      if (next_input_position >= input_stat.size) {
        process.stdout.write(`${wt.threadId} Finished last chunk\n`);
        wt.parentPort.postMessage({ type: 'done' });
      }
    }
  } catch (e) {
    process.stderr.write(e);
  } finally {
    input_handle?.close();
  }
});

/**
 * @param {Object} arg
 * @param {Buffer} arg.entry
 * @param {Map<string, Record>} arg.record_by_name
 * @returns
 */
function parse_input_entry({ entry, record_by_name }) {
  const sc_index = entry.indexOf(SC_BYTE);
  const name = entry.toString('utf-8', 0, sc_index);
  const temp = parseFloat(entry.toString('utf-8', sc_index + 1));

  let record = record_by_name.get(name);
  if (record === undefined) {
    record = new Record();
    record_by_name.set(record);
  }
  record.process(temp);

  return [name, record];
}

/**
 * @param {Object} arg
 * @param {Buffer} arg.chunk
 * @param {Map<string, Record>} arg.record_by_name
 */
function parse_input_chunk({ chunk, record_by_name }) {
  let lf_index = -1;
  let read_offset = 0;
  function has_entry() {
    lf_index = chunk.indexOf(LF_BYTE, read_offset);
    return lf_index !== -1;
  }

  /**
   * @type {[string, import('./parser.js').Record][]} entry
   */
  const entries = [];
  while (has_entry()) {
    const start_of_entry = read_offset;
    const end_of_entry = lf_index;
    const bytes = chunk.subarray(start_of_entry, end_of_entry);
    const entry = parse_input_entry({ entry: bytes, record_by_name });
    entries.push(entry);
    read_offset = end_of_entry + 1;
  }

  return entries;
}
