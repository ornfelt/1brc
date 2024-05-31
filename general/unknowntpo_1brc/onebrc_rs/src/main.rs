use pyroscope::PyroscopeAgent;
use pyroscope_pprofrs::{pprof_backend, PprofConfig};
use std::collections::HashMap;
use std::io::BufRead;

struct Status {
    min: f64,
    max: f64,
    sum: f64,
    count: u32,
}

impl Status {
    fn avg(&self) -> f64 {
        self.sum / self.count as f64
    }

    fn set_val(&mut self, v: f64) {
        if v < self.min {
            self.min = v;
        }
        if v > self.max {
            self.max = v;
        }
        self.sum += v;
        self.count += 1;
    }
}

fn main() {
    let agent = PyroscopeAgent::builder("http://localhost:4040", "myapp-profile")
        .backend(pprof_backend(PprofConfig::new().sample_rate(100)))
        .build()
        .unwrap();

    let agent_running = agent.start().unwrap();

    // Open file and readline
    const FILE_NAME: &str = "../data/measurements.txt";
    let file = std::fs::File::open(FILE_NAME).unwrap();
    let reader = std::io::BufReader::new(file);

    // Skip first two line
    let mut lines = reader.lines();
    lines.next();
    lines.next();

    // Define map to store the status and station name
    let mut station: HashMap<String, Status> = HashMap::new();

    for line in lines {
        let line = line.unwrap();
        // println!("{}", line);
        let parts: Vec<&str> = line.split(";").collect();

        let station_name = parts[0].to_string();
        let temperature = parts[1].parse::<f64>().unwrap();

        if station.contains_key(&station_name) {
            let mut status = station.get_mut(&station_name).unwrap();
            status.set_val(temperature);
        } else {
            let status = Status {
                min: temperature,
                max: temperature,
                sum: temperature,
                count: 1,
            };
            station.insert(station_name, status);
        }
    }

    for (name, status) in station.iter() {
        println!("{}, {}, {}, {}", name, status.min, status.avg(), status.max);
    }

    let agent_ready = agent_running.stop().unwrap();
    agent_ready.shutdown();
}
