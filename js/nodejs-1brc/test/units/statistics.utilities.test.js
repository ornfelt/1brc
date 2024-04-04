import assert from 'node:assert';
import { describe, it } from 'node:test';
import {
  take_extremes_of,
  take_maximum_of,
  take_mean_of,
  take_minimum_of,
  take_sum_of,
} from '../../src/utilities/statistics.utility.js';

describe('utilities/statistics', () => {
  describe('take_sum_of()', () => {
    it('should return 0', () => {
      const samples = [];
      const expected_sum = 0;
      const actual_sum = take_sum_of(samples);
      assert.equal(actual_sum, expected_sum);
    });

    it('should return 4', () => {
      const samples = [4];
      const expected_sum = 4;
      const actual_sum = take_sum_of(samples);
      assert.equal(actual_sum, expected_sum);
    });

    it('should return 12', () => {
      const samples = [0, 1, 1, 2, 3, 5];
      const expected_sum = 12;
      const actual_sum = take_sum_of(samples);
      assert.equal(actual_sum, expected_sum);
    });

    it('should return 12', () => {
      const samples = [-1, -1, -2, -3, -5, 0];
      const expected_sum = -12;
      const actual_sum = take_sum_of(samples);
      assert.equal(actual_sum, expected_sum);
    });

    it('should return 4', () => {
      const samples = [-5, -3, 0, 1, 1, 2];
      const expected_sum = -4;
      const actual_sum = take_sum_of(samples);
      assert.equal(actual_sum, expected_sum);
    });
  });

  describe('take_mean_of()', () => {
    const TOLERATED_EPSILON = 0.00001;

    it('should return 0', () => {
      const samples = [];
      const expected_mean = NaN;
      const actual_mean = take_mean_of(samples);
      assert.equal(actual_mean, expected_mean);
    });

    it('should return 4', () => {
      const samples = [4];
      const expected_mean = 4;
      const actual_mean = take_mean_of(samples);
      const actual_epsilon = Math.abs(actual_mean - expected_mean);
      assert.ok(actual_epsilon < TOLERATED_EPSILON);
    });

    it('should return 2', () => {
      const samples = [0, 1, 1, 2, 3, 5];
      const expected_mean = 2;
      const actual_mean = take_mean_of(samples);
      const actual_epsilon = Math.abs(actual_mean - expected_mean);
      assert.ok(actual_epsilon < TOLERATED_EPSILON);
    });

    it('should return -2', () => {
      const samples = [-1, -1, -2, -3, -5, 0];
      const expected_mean = -2;
      const actual_mean = take_mean_of(samples);
      const actual_epsilon = Math.abs(actual_mean - expected_mean);
      assert.ok(actual_epsilon < TOLERATED_EPSILON);
    });

    it('should return -2/3', () => {
      const samples = [-5, -3, 0, 1, 1, 2];
      const expected_mean = -2 / 3;
      const actual_mean = take_mean_of(samples);
      const actual_epsilon = Math.abs(actual_mean - expected_mean);
      assert.ok(actual_epsilon < TOLERATED_EPSILON);
    });
  });

  describe('take_extremes_of()', () => {
    describe('from unsorted samples', () => {
      it('should return NaN maximum and NaN minimum', () => {
        const samples = [];
        const expected_extremes = { maximum: NaN, minimum: NaN };
        const actual_extremes = take_extremes_of(samples);
        assert.deepStrictEqual(actual_extremes, expected_extremes);
      });

      it('should return 0 maximum and 0 minimum', () => {
        const samples = [0];
        const expected_extremes = { maximum: 0, minimum: 0 };
        const actual_extremes = take_extremes_of(samples);
        assert.deepStrictEqual(actual_extremes, expected_extremes);
      });

      it('should return 1 maximum and -1 minimum', () => {
        const samples = [-1, 1];
        const expected_extremes = { maximum: 1, minimum: -1 };
        const actual_extremes = take_extremes_of(samples);
        assert.deepStrictEqual(actual_extremes, expected_extremes);
      });

      it('should return -1 maximum and -1 minimum', () => {
        const samples = [-1, -1];
        const expected_extremes = { maximum: -1, minimum: -1 };
        const actual_extremes = take_extremes_of(samples);
        assert.deepStrictEqual(actual_extremes, expected_extremes);
      });

      it('should return 1 maximum and 1 minimum', () => {
        const samples = [1, 1];
        const expected_extremes = { maximum: 1, minimum: 1 };
        const actual_extremes = take_extremes_of(samples);
        assert.deepStrictEqual(actual_extremes, expected_extremes);
      });
    });

    describe('from ascendingly sorted samples', () => {
      it('should return NaN maximum and NaN minimum', () => {
        const samples = [];
        const expected_extremes = { maximum: NaN, minimum: NaN };
        const actual_extremes = take_extremes_of(samples, {
          is_ascending: true,
        });
        assert.deepStrictEqual(actual_extremes, expected_extremes);
      });

      it('should return 0 maximum and 0 minimum', () => {
        const samples = [0];
        const expected_extremes = { maximum: 0, minimum: 0 };
        const actual_extremes = take_extremes_of(samples, {
          is_ascending: true,
        });
        assert.deepStrictEqual(actual_extremes, expected_extremes);
      });

      it('should return 1 maximum and -1 minimum', () => {
        const samples = [-1, 1];
        const expected_extremes = { maximum: 1, minimum: -1 };
        const actual_extremes = take_extremes_of(samples, {
          is_ascending: true,
        });
        assert.deepStrictEqual(actual_extremes, expected_extremes);
      });

      it('should return -1 maximum and -1 minimum', () => {
        const samples = [-1, -1];
        const expected_extremes = { maximum: -1, minimum: -1 };
        const actual_extremes = take_extremes_of(samples, {
          is_ascending: true,
        });
        assert.deepStrictEqual(actual_extremes, expected_extremes);
      });

      it('should return 1 maximum and 1 minimum', () => {
        const samples = [1, 1];
        const expected_extremes = { maximum: 1, minimum: 1 };
        const actual_extremes = take_extremes_of(samples, {
          is_ascending: true,
        });
        assert.deepStrictEqual(actual_extremes, expected_extremes);
      });

      it('should incorrectly return -1 maximum and 1 minimum', () => {
        const samples = [1, -1];
        const expected_extremes = { maximum: -1, minimum: 1 };
        const actual_extremes = take_extremes_of(samples, {
          is_ascending: true,
        });
        assert.deepStrictEqual(actual_extremes, expected_extremes);
      });
    });

    describe('from descendingly sorted samples', () => {
      it('should return NaN maximum and NaN minimum', () => {
        const samples = [];
        const expected_extremes = { maximum: NaN, minimum: NaN };
        const actual_extremes = take_extremes_of(samples, {
          is_descending: true,
        });
        assert.deepStrictEqual(actual_extremes, expected_extremes);
      });

      it('should return 0 maximum and 0 minimum', () => {
        const samples = [0];
        const expected_extremes = { maximum: 0, minimum: 0 };
        const actual_extremes = take_extremes_of(samples, {
          is_descending: true,
        });
        assert.deepStrictEqual(actual_extremes, expected_extremes);
      });

      it('should return 1 maximum and -1 minimum', () => {
        const samples = [1, -1];
        const expected_extremes = { maximum: 1, minimum: -1 };
        const actual_extremes = take_extremes_of(samples, {
          is_descending: true,
        });
        assert.deepStrictEqual(actual_extremes, expected_extremes);
      });

      it('should return -1 maximum and -1 minimum', () => {
        const samples = [-1, -1];
        const expected_extremes = { maximum: -1, minimum: -1 };
        const actual_extremes = take_extremes_of(samples, {
          is_descending: true,
        });
        assert.deepStrictEqual(actual_extremes, expected_extremes);
      });

      it('should return 1 maximum and 1 minimum', () => {
        const samples = [1, 1];
        const expected_extremes = { maximum: 1, minimum: 1 };
        const actual_extremes = take_extremes_of(samples, {
          is_descending: true,
        });
        assert.deepStrictEqual(actual_extremes, expected_extremes);
      });

      it('should incorrectly return samples -1 maximum and 1 minimum', () => {
        const samples = [-1, 1];
        const expected_extremes = { maximum: -1, minimum: 1 };
        const actual_extremes = take_extremes_of(samples, {
          is_descending: true,
        });
        assert.deepStrictEqual(actual_extremes, expected_extremes);
      });
    });
  });

  describe('take_maximum_of()', () => {
    describe('from unsorted samples', () => {
      it('should return NaN', () => {
        const samples = [];
        const expected_maximum = NaN;
        const actual_maximum = take_maximum_of(samples);
        assert.equal(actual_maximum, expected_maximum);
      });

      it('should return 0', () => {
        const samples = [0];
        const expected_maximum = 0;
        const actual_maximum = take_maximum_of(samples);
        assert.equal(actual_maximum, expected_maximum);
      });

      it('should return 1', () => {
        const samples = [-1, 1];
        const expected_maximum = 1;
        const actual_maximum = take_maximum_of(samples);
        assert.equal(actual_maximum, expected_maximum);
      });

      it('should return -1', () => {
        const samples = [-1, -1];
        const expected_maximum = -1;
        const actual_maximum = take_maximum_of(samples);
        assert.equal(actual_maximum, expected_maximum);
      });

      it('should return 1', () => {
        const samples = [1, 1];
        const expected_maximum = 1;
        const actual_maximum = take_maximum_of(samples);
        assert.equal(actual_maximum, expected_maximum);
      });
    });

    describe('from ascendingly sorted samples', () => {
      it('should return NaN', () => {
        const samples = [];
        const expected_maximum = NaN;
        const actual_maximum = take_maximum_of(samples, {
          is_ascending: true,
        });
        assert.equal(actual_maximum, expected_maximum);
      });

      it('should return 0', () => {
        const samples = [0];
        const expected_maximum = 0;
        const actual_maximum = take_maximum_of(samples, {
          is_ascending: true,
        });
        assert.equal(actual_maximum, expected_maximum);
      });

      it('should return 1', () => {
        const samples = [-1, 1];
        const expected_maximum = 1;
        const actual_maximum = take_maximum_of(samples, {
          is_ascending: true,
        });
        assert.equal(actual_maximum, expected_maximum);
      });

      it('should return -1', () => {
        const samples = [-1, -1];
        const expected_maximum = -1;
        const actual_maximum = take_maximum_of(samples, {
          is_ascending: true,
        });
        assert.equal(actual_maximum, expected_maximum);
      });

      it('should return 1', () => {
        const samples = [1, 1];
        const expected_maximum = 1;
        const actual_maximum = take_maximum_of(samples, {
          is_ascending: true,
        });
        assert.equal(actual_maximum, expected_maximum);
      });

      it('should incorrectly return -1', () => {
        const samples = [1, -1];
        const expected_maximum = -1;
        const actual_maximum = take_maximum_of(samples, {
          is_ascending: true,
        });
        assert.equal(actual_maximum, expected_maximum);
      });
    });

    describe('from descendingly sorted samples', () => {
      it('should return NaN', () => {
        const samples = [];
        const expected_maximum = NaN;
        const actual_maximum = take_maximum_of(samples, {
          is_descending: true,
        });
        assert.equal(actual_maximum, expected_maximum);
      });

      it('should return 0', () => {
        const samples = [0];
        const expected_maximum = 0;
        const actual_maximum = take_maximum_of(samples, {
          is_descending: true,
        });
        assert.equal(actual_maximum, expected_maximum);
      });

      it('should return 1', () => {
        const samples = [1, -1];
        const expected_maximum = 1;
        const actual_maximum = take_maximum_of(samples, {
          is_descending: true,
        });
        assert.equal(actual_maximum, expected_maximum);
      });

      it('should return -1', () => {
        const samples = [-1, -1];
        const expected_maximum = -1;
        const actual_maximum = take_maximum_of(samples, {
          is_descending: true,
        });
        assert.equal(actual_maximum, expected_maximum);
      });

      it('should return 1', () => {
        const samples = [1, 1];
        const expected_maximum = 1;
        const actual_maximum = take_maximum_of(samples, {
          is_descending: true,
        });
        assert.equal(actual_maximum, expected_maximum);
      });

      it('should incorrectly return -1', () => {
        const samples = [-1, 1];
        const expected_maximum = -1;
        const actual_maximum = take_maximum_of(samples, {
          is_descending: true,
        });
        assert.equal(actual_maximum, expected_maximum);
      });
    });
  });

  describe('take_minimum_of()', () => {
    describe('from unsorted samples', () => {
      it('should return samples NaN', () => {
        const samples = [];
        const expected_minimum = NaN;
        const actual_minimum = take_minimum_of(samples);
        assert.equal(actual_minimum, expected_minimum);
      });

      it('should return 0', () => {
        const samples = [0];
        const expected_minimum = 0;
        const actual_minimum = take_minimum_of(samples);
        assert.equal(actual_minimum, expected_minimum);
      });

      it('should return 1', () => {
        const samples = [-1, 1];
        const expected_minimum = -1;
        const actual_minimum = take_minimum_of(samples);
        assert.equal(actual_minimum, expected_minimum);
      });

      it('should return -1', () => {
        const samples = [-1, -1];
        const expected_minimum = -1;
        const actual_minimum = take_minimum_of(samples);
        assert.equal(actual_minimum, expected_minimum);
      });

      it('should return 1', () => {
        const samples = [1, 1];
        const expected_minimum = 1;
        const actual_minimum = take_minimum_of(samples);
        assert.equal(actual_minimum, expected_minimum);
      });
    });

    describe('from ascendingly sorted samples', () => {
      it('should return NaN', () => {
        const samples = [];
        const expected_minimum = NaN;
        const actual_minimum = take_minimum_of(samples, {
          is_ascending: true,
        });
        assert.equal(actual_minimum, expected_minimum);
      });

      it('should return 0', () => {
        const samples = [0];
        const expected_minimum = 0;
        const actual_minimum = take_minimum_of(samples, {
          is_ascending: true,
        });
        assert.equal(actual_minimum, expected_minimum);
      });

      it('should return 1', () => {
        const samples = [-1, 1];
        const expected_minimum = -1;
        const actual_minimum = take_minimum_of(samples, {
          is_ascending: true,
        });
        assert.equal(actual_minimum, expected_minimum);
      });

      it('should return -1', () => {
        const samples = [-1, -1];
        const expected_minimum = -1;
        const actual_minimum = take_minimum_of(samples, {
          is_ascending: true,
        });
        assert.equal(actual_minimum, expected_minimum);
      });

      it('should return 1', () => {
        const samples = [1, 1];
        const expected_minimum = 1;
        const actual_minimum = take_minimum_of(samples, {
          is_ascending: true,
        });
        assert.equal(actual_minimum, expected_minimum);
      });

      it('should incorrectly return -1', () => {
        const samples = [1, -1];
        const expected_minimum = 1;
        const actual_minimum = take_minimum_of(samples, {
          is_ascending: true,
        });
        assert.equal(actual_minimum, expected_minimum);
      });
    });

    describe('from descendingly sorted samples', () => {
      it('should return NaN', () => {
        const samples = [];
        const expected_minimum = NaN;
        const actual_minimum = take_minimum_of(samples, {
          is_descending: true,
        });
        assert.equal(actual_minimum, expected_minimum);
      });

      it('should return 0', () => {
        const samples = [0];
        const expected_minimum = 0;
        const actual_minimum = take_minimum_of(samples, {
          is_descending: true,
        });
        assert.equal(actual_minimum, expected_minimum);
      });

      it('should return 1', () => {
        const samples = [1, -1];
        const expected_minimum = -1;
        const actual_minimum = take_minimum_of(samples, {
          is_descending: true,
        });
        assert.equal(actual_minimum, expected_minimum);
      });

      it('should return -1', () => {
        const samples = [-1, -1];
        const expected_minimum = -1;
        const actual_minimum = take_minimum_of(samples, {
          is_descending: true,
        });
        assert.equal(actual_minimum, expected_minimum);
      });

      it('should return 1', () => {
        const samples = [1, 1];
        const expected_minimum = 1;
        const actual_minimum = take_minimum_of(samples, {
          is_descending: true,
        });
        assert.equal(actual_minimum, expected_minimum);
      });

      it('should incorrectly return -1', () => {
        const samples = [-1, 1];
        const expected_minimum = 1;
        const actual_minimum = take_minimum_of(samples, {
          is_descending: true,
        });
        assert.equal(actual_minimum, expected_minimum);
      });
    });
  });
});
