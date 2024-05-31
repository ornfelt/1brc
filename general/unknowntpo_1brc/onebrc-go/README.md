# 1brc-go: 1brc challenge in Go.

## Approach 1: Bufio with single goroutine file parsing + aggregation 

```
________________________________________________________
Executed in  180.43 secs    fish           external
   usr time  153.96 secs    0.06 millis  153.96 secs
   sys time   10.33 secs    1.17 millis   10.32 secs

## Approach 2A: bench FileChunkReader: Read with single goroutine

```
$ go test -v -short ./... -run=^$ -bench=.
goos: darwin
goarch: arm64
pkg: github.com/unknowntpo/1brc/onebrc-go
BenchmarkFileChunkReader
BenchmarkFileChunkReader/read_and_print_file_content:_./data/weather_stations.csv
BenchmarkFileChunkReader/read_and_print_file_content:_./data/weather_stations.csv-8             1000000000               0.0002890 ns/op
PASS
ok      github.com/unknowntpo/1brc/onebrc-go    0.356s
```

## Approach 2B: bench FileChunkReader: Read with multiple goroutine

```
go test -v -short ./... -run=^$ -bench=.
goos: darwin
goarch: arm64
pkg: github.com/unknowntpo/1brc/onebrc-go
BenchmarkFileChunkReader
BenchmarkFileChunkReader/read_and_print_file_content:_./data/weather_stations.csv
BenchmarkFileChunkReader/read_and_print_file_content:_./data/weather_stations.csv-8             1000000000               0.001613 ns/op
PASS
ok      github.com/unknowntpo/1brc/onebrc-go    0.297s
```

________________________________________________________
Executed in  347.84 secs    fish           external
   usr time  216.12 secs   59.00 micros  216.12 secs
   sys time  179.62 secs  902.00 micros  179.62 secs

## Approach 2C: Run main program without and 8 workers

________________________________________________________
Executed in   77.38 secs    fish           external
   usr time   45.83 secs   58.00 micros   45.83 secs
   sys time   30.11 secs  922.00 micros   30.11 secs

## Approach 2D: Run main program with sync.Pool and 8 workers (this program does not PASS the test)

________________________________________________________
Executed in   39.26 secs    fish           external
   usr time   11.40 secs   57.00 micros   11.40 secs
   sys time   47.99 secs  909.00 micros   47.99 secs


## Approach 2E: Run main program with sync.Pool and 200 workers

________________________________________________________
Executed in    1.41 secs    fish           external
   usr time    1.42 secs    0.09 millis    1.42 secs
   sys time    1.35 secs    1.37 millis    1.35 secs