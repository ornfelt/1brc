import fs from 'fs';
import readline from 'readline';

// Tokyo;35.6897
// Jakarta;-6.1750
// Delhi;28.6100
// Guangzhou;23.1300
// Mumbai;19.0761
// Manila;14.5958
// Shanghai;31.1667
// São Paulo;-23.5500
// Seoul;37.5600


// {Abha=5.0/18.0/27.4, Abidjan=15.7/26.0/34.1, Abéché=12.1/29.4/35.6, Accra=14.7/26.4/33.1, Addis Ababa=2.1/16.0/24.3, Adelaide=4.1/17.3/29.7, ...}
// result format: min, mean, max

interface result {
  min: number;
  max: number;
  mean: number;
  count: number;
  total: number;
}

function processData(m: Map<string, result>, line: string) {
  const data = line.split(';');
  const city = data[0];
  const num = Number(data[1]);
  if (m.has(city)) {
    const entry = m.get(city) as result;
    entry.total += num;
    entry.count += 1;

    entry.min = (num < entry.min) ? num : entry.min;
    entry.max = (num > entry.max) ? num : entry.max;
    entry.mean = entry.total / entry.count;
  } else {
    m.set(city, { min: num, max: num, mean: num, count: 1, total: num });
  }
}

async function compute(filePath: string): Promise<Map<string, result>> {
  const stream = fs.createReadStream(filePath);
  const rl = readline.createInterface({ input: stream });
  let m: Map<string, result> = new Map();

  return new Promise((resolve, reject) => {
    // Convert line-by-line processing into a Promise
    rl.on('line', (line) => {
      processData(m, line);
    });

    rl.on('close', () => {
      console.log(`closed event`);
      resolve(m); // Resolve when file processing is complete
    });

    rl.on('error', (err) => {
      stream.close();
      reject(err); // Reject the Promise if any error occurs
    });
  });
}

export {
  compute
}
