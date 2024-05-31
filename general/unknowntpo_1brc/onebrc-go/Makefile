
all: help

# ==================================================================================== #
# HELPERS
# ==================================================================================== #

## help: print this help message
.PHONY: help
help:
	@echo 'Usage:'
	@sed -n 's/^##//p' ${MAKEFILE_LIST} | column -t -s ':' |  sed -e 's/^/ /'

# ==================================================================================== #
# RUN
# ==================================================================================== #


## run: execute main program
.PHONY: run
run:
	@go run . compute -f ../data/measurements.txt  


## test: execute tests
.PHONY: test
test:
	@go test -race -v ./...
## bench: execute benchmark
.PHONY: bench
bench:
	go test -v -short ./... -run=^$$ -bench=. -cpuprofile cpu.out -memprofile mem.out
