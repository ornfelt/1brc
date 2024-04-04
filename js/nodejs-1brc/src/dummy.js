import os from 'node:os';
import path from 'node:path';
import wt from 'node:worker_threads';
import { is_main_module } from './utilities/modules.utility.js';

if (!is_main_module(import.meta)) {
  console.log(`script ${__filename} is expected to run as main module`);
  process.exit(0);
}

if (!wt.isMainThread) {
  console.log(`script ${__filename} is expected to run in the main thread`);
  process.exit(0);
}

const I64_BYTE_SIZE = 8;
const i64b = new SharedArrayBuffer(2 * I64_BYTE_SIZE);
const i64a = new BigInt64Array(i64b);

const WORKER_WAKE_UP = 0;
const workers = os.cpus().map((_, i) => {
  const worker = new wt.Worker(path.resolve('src', 'parse.js'), {
    env: wt.SHARE_ENV,
    workerData: { i64a: i64a },
  });
  const thread_id = worker.threadId;

  const destroy = function destroy_current_worker() {
    worker.terminate();
    worker.unref();
    workers.slice(i);
  };

  worker.on('message', function on_worker_message(data) {
    console.log(`[${thread_id}]`, data);
  });

  worker.on('error', function on_worker_error(data) {
    console.error(`[${thread_id}]`, data);
  });

  worker.on('exit', function on_worker_exit(code) {
    // console.log(`[${thread_id}] exit=${code}`);
    destroy();
  });

  return worker;
});

console.log(
  i64a[WORKER_WAKE_UP],
  BigInt(workers.length),
  i64a[WORKER_WAKE_UP] === BigInt(workers.length),
);


Atomics.add(i64a, WORKER_WAKE_UP, 1n);
Atomics.notify(i64a, WORKER_WAKE_UP);
