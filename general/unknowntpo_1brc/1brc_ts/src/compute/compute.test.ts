import { describe, test, expect } from '@jest/globals';
import { compute } from './compute';

describe('1+1', () => {
  test('should be 2', () => {
    expect(1 + 1).toBe(2);
  })
})

describe('compute', () => {
  test('should return min, mean, max', async () => {
    const filePath = './data/testdata.txt';
    const res = await compute(filePath);
    const want = {
      "Tokyo": { "count": 2, "max": 35.6897, "mean": 34.6897, "min": 33.6897, total: 69.3794 },
      "Jakarta": { "count": 1, "max": -6.175, "mean": -6.175, "min": -6.175, total: -6.175, },
      "Delhi": { "count": 1, "max": 28.61, "mean": 28.61, "min": 28.61, total: 28.61 },
      "Guangzhou": { "count": 2, "max": 43.13, "mean": 33.13, "min": 23.13, total: 66.26 }
    };
    expect(res).toEqual(new Map(Object.entries(want)));
  })
})
