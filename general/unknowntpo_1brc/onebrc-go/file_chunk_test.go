package main

import (
	"bytes"
	"fmt"
	"io"
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestFileChunkReader(t *testing.T) {
	fileNames := []string{"./data/testdata.txt", "./data/weather_stations.csv"}
	for _, fileName := range fileNames {
		t.Run(fmt.Sprintf("read and print file content: %v", fileName), func(t *testing.T) {
			for _, fileName := range fileNames {
				f, err := os.Open(fileName)
				require.NoError(t, err)
				wantDataB, err := io.ReadAll(f)
				require.NoError(t, err)
				fr := NewFileChunkReader(fileName)

				// 1. Test fr.ReadAll
				gotDataB, err := fr.ReadAll()
				require.NoError(t, err)
				assert.Equalf(t, string(wantDataB), string(gotDataB), "file: %s, incorrect data got from ReadAll", f.Name())
				t.Log("ReadAll done")
				// 2. Test fr.ReadStream
				//
				t.Log("Test readStream")
				stream, errChan := fr.ReadStream()
				var buf bytes.Buffer
				for chunk := range stream {
					t.Logf("read stream from chunk, %v", chunk.buf.Len())
					buf.WriteString(chunk.buf.String())
				}
				require.NoError(t, <-errChan)
				assert.Equalf(t, len(buf.Bytes()), len(gotDataB), "file: %s, incorrect data got from ReadStream", f.Name())
				t.Log("ReadStream done")
			}
		})
	}
}

func BenchmarkFileChunkReader(b *testing.B) {
	fileNames := []string{"./data/weather_stations.csv"}
	for _, fileName := range fileNames {
		b.Run(fmt.Sprintf("read and print file content: %v", fileName), func(b *testing.B) {
			for _, fileName := range fileNames {
				fr := NewFileChunkReader(fileName)
				_, err := fr.ReadAll()
				require.NoError(b, err)
			}
		})
	}
}
