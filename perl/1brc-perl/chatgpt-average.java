// This is code posted on Hacker News by user 'LeoPanthera
// Original comment (dead): https://news.ycombinator.com/item?id=38863549
// Code link: https://pastebin.com/KaJp2HSq
// Please note that I make no copyright claims on this code!

import java.nio.file.*;
import java.io.*;
import java.util.*;

public class TemperatureStats {
    public static void main(String[] args) {
        // File path for the large text file
        String filePath = "./measurements.txt";
        
        // HashMap to store the temperature data per station
        Map<String, DoubleSummaryStatistics> stationTemperatures = new TreeMap<>();

        try (BufferedReader br = Files.newBufferedReader(Paths.get(filePath))) {
            String line;
            while ((line = br.readLine()) != null) {
                // Splitting each line by ";"
                String[] parts = line.split(";");
                String station = parts[0];
                double temperature = Double.parseDouble(parts[1]);

                // Compute statistics for each station
                stationTemperatures.computeIfAbsent(station, k -> new DoubleSummaryStatistics())
                                   .accept(temperature);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        // Formatting and printing the output
        for (Map.Entry<String, DoubleSummaryStatistics> entry : stationTemperatures.entrySet()) {
            DoubleSummaryStatistics stats = entry.getValue();
            System.out.printf("%s=%.1f/%.1f/%.1f, ", entry.getKey(), stats.getMin(), stats.getAverage(), stats.getMax());
        }
    }
}
