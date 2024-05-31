package onebrc.java;

import java.text.MessageFormat;

public class Result {
    private String city;
    private float min;
    private float max;
    private float mean;
    private int count;

    private float total;

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public float getMin() {
        return min;
    }

    public void setMin(float min) {
        this.min = min;
    }

    public float getMax() {
        return max;
    }

    public void setMax(float max) {
        this.max = max;
    }

    public float getMean() {
        return mean;
    }

    public void setMean(float mean) {
        this.mean = mean;
    }

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }

    public Result(String city, float min, float max, float mean, int count, float total) {
        this.city = city;
        this.min = min;
        this.max = max;
        this.mean = mean;
        this.count = count;
        this.total = total;
    }

    public float getTotal() {
        return this.total;
    }

    public void setTotal(float total) {
        this.total = total;
    }

    @Override
    public String toString() {
        return MessageFormat.format("city: {0}, min: {1}, max: {2}, mean: {3}, count: {4}, total: {5}",
                this.city,
                this.min,
                this.max,
                this.mean,
                this.count,
                this.total
        );
    }
}


