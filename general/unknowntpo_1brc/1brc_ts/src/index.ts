import { compute } from 'src/compute';
import { generateHeapSnapshot } from "bun";

async function main() {
  const filePath = '../1brc/measurements.txt';
  // const filePath = '../data/weather_stations.csv';

  try {
    const results = await compute(filePath);
    const snapshot = generateHeapSnapshot();
    await Bun.write("heap.json", JSON.stringify(snapshot, null, 2));
    //console.log(results);
  } catch (e) {
    console.error(e);
  }
}

main()
