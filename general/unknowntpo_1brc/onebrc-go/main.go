package main

import (
	"bufio"
	"fmt"
	"math"
	"os"
	"strconv"
	"strings"

	"github.com/urfave/cli/v2"
)

func must[T any](val T, err error) T {
	if err != nil {
		panic(err)
	}
	return val
}

type result struct {
	city  string
	min   float64
	max   float64
	mean  float64
	acc   float64
	count int
}

func compute(scanner *bufio.Scanner) (map[string]result, error) {
	m := make(map[string]result, 100)
	for scanner.Scan() {
		vals := strings.Split(scanner.Text(), ";")
		city := vals[0]
		temp := must(strconv.ParseFloat(vals[1], 64))
		if res, has := m[city]; has {
			m[city] = result{city: city, min: temp, max: temp, acc: 1, count: 1}
		} else {
			res.count++
			res.acc += temp
			res.min = math.Min(res.min, temp)
			res.max = math.Max(res.max, temp)
			res.mean = res.acc / float64(res.count)
			res.min = math.Min(res.min, temp)
			m[city] = res
		}
	}
	return m, nil
}

func main() {
	app := &cli.App{
		Name:  "1brc-go",
		Usage: "1brc-go challange",
		Commands: []*cli.Command{
			{
				Name:  "compute",
				Usage: "Performs a computation based on the provided file",
				Flags: []cli.Flag{
					&cli.StringFlag{
						Name:        "file",
						Aliases:     []string{"f"},
						Usage:       "Path to the file to be processed",
						Required:    false,
						DefaultText: "./data/weather_stations.csv",
					},
				},
				Action: func(c *cli.Context) error {
					filePath := c.String("file")
					fr := NewFileChunkReader(filePath)
					stream, errChan := fr.ReadStream()
					cnt := 0
					for chunk := range stream {
						_ = chunk
						cnt++
						releaseChunk(&chunk)
					}
					_ = must[error](nil, <-errChan)
					fmt.Println("cnt: ", cnt)
					return nil
					// TODO: parse file
					// f := must(os.Open(filePath))
					// defer f.Close()
					// scanner := bufio.NewScanner(bufio.NewReader(f))
					// m := must(compute(scanner))
					// fmt.Println(m)
					// return nil
				},
			},
		},
	}
	if err := app.Run(os.Args); err != nil {
		panic(err)
	}
}
