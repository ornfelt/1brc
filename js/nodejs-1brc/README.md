# nodejs-1brc
Exploring the [1 billion row challenge](https://github.com/gunnarmorling/1brc]) with Node.js


## TODO
1. Implement tests cases in `test/fixtures/measurements`
2. Optimize communication between main and worker threads


## Bug ideas
- Unsynchronized map updates
- Faulty file partitioning
- Ignoring chunk's left over while parsing measurements
