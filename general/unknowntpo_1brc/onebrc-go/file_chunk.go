package main

import (
	"bytes"
	"errors"
	"fmt"
	"io"
	"math"
	"os"
	"sync"

	"golang.org/x/sync/errgroup"
)

type FileChunkReader struct {
	// f is the underlining file that need to be read.
	fileName      string
	chunks        []chunk
	afterReadHook func()
}

type chunk struct {
	buf *bytes.Buffer
}

var chunkPool = sync.Pool{
	New: func() any {
		dataBytes := make([]byte, CHUNK_SIZE)
		return &chunk{buf: bytes.NewBuffer(dataBytes)} // Return a pointer
	},
}

func releaseChunk(c *chunk) {
	c.buf.Reset() // Clear buffer for reuse
	chunkPool.Put(c)
}

func NewFileChunkReader(fileName string) *FileChunkReader {
	return &FileChunkReader{
		fileName: fileName,
		chunks:   make([]chunk, 0, 100),
	}
}

// NumChunks returns number of chunks in FileChunkReader.
func (fr *FileChunkReader) NumChunks() int {
	return len(fr.chunks)
}

func (fr *FileChunkReader) GetChunk(idx int) (chunk, error) {
	if idx >= len(fr.chunks) || idx < 0 {
		return chunk{}, errors.New("Invalid index")
	}
	return fr.chunks[idx], nil
}

const CHUNK_SIZE = 8192

func (fr *FileChunkReader) ReadAll() ([]byte, error) {
	appendFn := func(ck chunk) chunk {
		return ck
	}
	if err := fr.read(appendFn); err != nil {
		return nil, fmt.Errorf("failed to read from file: %v", err)
	}
	var buf bytes.Buffer
	for _, ck := range fr.chunks {
		buf.WriteString(ck.buf.String())
	}
	return buf.Bytes(), nil
}

func (fr *FileChunkReader) ReadStream() (<-chan chunk, <-chan error) {
	ch := make(chan chunk, 200)
	// FIXME: rename to read middleware fn ?
	// FIXME: Who close the channel ?
	appendFn := func(ck chunk) chunk {
		ch <- ck
		return ck
	}
	fr.afterReadHook = func() {
		close(ch)
	}
	errChan := make(chan error)
	go func() {
		defer close(errChan)
		if err := fr.read(appendFn); err != nil {
			errChan <- fmt.Errorf("failed to read from file: %v", err)
		}
	}()
	return ch, errChan
}

// appendFn is used to append chunk to FileChunkReader.chunks,
// you can also customize some operation, such as make a channel and stream chunk to caller.
type appendFn func(ck chunk) chunk

func (fr *FileChunkReader) read(fn appendFn) error {
	f, err := os.Open(fr.fileName)
	defer f.Close()
	if err != nil {
		return err
	}
	info, err := f.Stat()
	if err != nil {
		return err
	}

	totalSize := info.Size()
	numOfChunks := int(math.Ceil(float64(totalSize) / float64(CHUNK_SIZE)))
	fmt.Println("numofchunks", numOfChunks)

	fr.chunks = make([]chunk, numOfChunks)

	numOfWorkers := 200
	group := new(errgroup.Group)
	for i := 0; i < numOfWorkers; i++ {
		i := i
		group.Go(func() error {
			f, err := os.Open(fr.fileName)
			defer f.Close()
			for c := i; c < numOfChunks; c += numOfWorkers {
				offset := c * CHUNK_SIZE
				// dataBytes := make([]byte, CHUNK_SIZE)
				if err != nil {
					return err
				}
				ck := *(chunkPool.Get().(*chunk))
				n, err := f.ReadAt(ck.buf.Bytes(), int64(offset))
				if err != nil {
					switch err {
					case io.EOF:
						break
					default:
						return err
					}
				}
				if n < CHUNK_SIZE {
					// shrink the data
					// dataBytes = dataBytes[:n]
					ck.buf.Truncate(n)
				}
				fr.chunks[c] = fn(ck)
				// fmt.Println("read done for idx ", i)
			}
			return nil
		})
	}

	// Wait for all HTTP fetches to complete.
	if err := group.Wait(); err != nil {
		return err
	}

	// executing afterReadHook
	if fr.afterReadHook != nil {
		fr.afterReadHook()
	}

	return nil
}
