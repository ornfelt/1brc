import os from 'node:os';
import path from 'node:path';
import wt from 'node:worker_threads';
import {
  FALSE,
  I32_SIZE,
  I64_SIZE,
  VALUE,
} from './constants/concurrency.constants.js';
import { _KiB } from './constants/information.constant.js';
import { cli } from './utilities/command-line.utility.js';
import { is_secondary_module } from './utilities/modules.utility.js';
import { create_contextual_console } from './utilities/console.utility.js';

if (is_secondary_module(import.meta)) {
  throw new Error('Expected to run as entry point');
}

const args = cli.read([
  {
    name: 'measurements-path',
    type: 'fs-path',
    required: true,
  },
  {
    name: 'worker-count',
    type: 'integer',
    default: os.cpus().length,
  },
]);

const record_by_name = new Map();
const ranges = [];

const is_updating_input_position = create_shared_i32a(1);
Atomics.store(is_updating_input_position, VALUE, FALSE);

const atomic_input_position = create_shared_i64a(1);
Atomics.store(atomic_input_position, VALUE, 0n);

const input_path = args['measurements-path'];

const workers = Array.from({ length: args['worker-count'] }).map(() => {
  const parsing_script_path = path.resolve('src', 'parse.js');
  const worker = new wt.Worker(parsing_script_path, {
    env: wt.SHARE_ENV,
    workerData: {
      atomic_input_position,
      is_updating_input_position,
      input_path,
    },
  });

  return worker;
});

workers.forEach((worker) => {
  const worker_console = create_worker_console(worker.threadId);

  worker.on('message', (data) => {
    switch (data.type) {
      case 'record': {
        for (const [name, record] of data.value) {
          record_by_name.set(name, record);
        }
        break;
      }
      case 'range': {
        ranges.push(data.value);
        break;
      }
      case 'done': {
        worker_console.debug('me');
        destroy_workers();
        print_summary();
        process.exit(0);
        break;
      }
      default: {
        worker_console.debug('Received unknown message');
      }
    }
  });

  worker.on('error', (e) => {
    worker_console.error(e);
  });

  worker.postMessage({
    chunk_size: 64 * _KiB,
    input_path,
    // atomic_input_position,
    // is_updating_input_position,
  });
});

function create_shared_i32a(length) {
  const len = length * I32_SIZE;
  const sab = new SharedArrayBuffer(len);
  const arr = new Int32Array(sab);
  return arr;
}

function create_shared_i64a(length) {
  const len = length * I64_SIZE;
  const sab = new SharedArrayBuffer(len);
  const arr = new BigInt64Array(sab);
  return arr;
}

/**
 * @param {number} worker_id
 */
function create_worker_console(worker_id) {
  return create_contextual_console(
    `WORKER_${worker_id.toString(10).padStart(2, '0')}`,
  );
}

function destroy_workers() {
  workers.forEach((worker) => {
    worker.unref();
    worker.terminate();
  });
  workers.slice();
}

function print_summary() {
  const sorted_names = Array.from(record_by_name.keys()).sort();
  process.stdout.write('{');
  for (let i = 0; i < sorted_names.length; i++) {
    const name = sorted_names[i];
    const record = record_by_name.get(name);
    if (i === sorted_names.length - 1) {
      process.stdout.write(`${name}=${record.toString()}`);
    } else {
      process.stdout.write(`${name}=${record.toString()}, `);
    }
  }
  process.stdout.write('}');
}
