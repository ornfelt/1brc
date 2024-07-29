ifndef NTHREADS
NTHREADS=$(shell nproc --all 2>/dev/null || sysctl -n hw.logicalcpu)
endif

CFLAGS=-std=c17 -O2 -m64 -march=native -mtune=native -flto
CFLAGS+=-Wall -Wextra -Wconversion -Wformat -Wformat=2 -Wimplicit-fallthrough -Wvla
CFLAGS+=-DNTHREADS=$(NTHREADS)

ifdef DEBUG
CFLAGS+=-g -fno-omit-frame-pointer -fsanitize=address,undefined -fstack-protector-strong -fstack-clash-protection
CFLAGS+=-D_FORTIFY_SOURCE=3
endif

all: bin/ bin/create-sample bin/analyze bin/hash bin/memory_bandwidth

bin/:
	mkdir -p bin/

bin/create-sample: create-sample.c
	$(CC) $(CFLAGS) $^ -lm -o $@

bin/analyze: analyze.c
	$(CC) $(CFLAGS) $^ -o $@

bin/hash: hash.c
	$(CC) $(CFLAGS) $^ -o $@

bin/memory_bandwidth: memory_bandwidth.c
	$(CC) $(CFLAGS) -std=gnu17 $^ -o $@

.PHONY: clean
clean:
	rm -r bin/
