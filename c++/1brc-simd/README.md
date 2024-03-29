# 1brc-simd
Process 1 billion row of text data as fast as possible

https://www.morling.dev/blog/one-billion-row-challenge/

-----------
Discussion thread: https://github.com/gunnarmorling/1brc/discussions/138

Use sha256sum to check that output is same as reference output
a55d0d9d02661c33538f2e11bb86f1825a5f015d6dd3645416ec71bc50099ee5  result.txt

The output should contain 1 end-line characters
New line characters might cause problems. If sha256sum is different, check content of file.

I used this file (generated by `./create_measurements.sh 1000000000`) to test:
https://drive.google.com/file/d/1HEyNw4M453n0tnuaAm9nwaCiLydQYnpo/view?usp=sharing

To test the 10K dataset, download the file below then `cat measurements.txt >> measurements_10k.txt` 5 times:
https://drive.google.com/file/d/1T-G9iPJ0L4hAt3U7FEig025B7SCxj6aX/view?usp=sharing

To run, just download the file above, extract, then `./run.sh`
To run with a different number of threads, just `./run.sh 32`

This code use a trick to practically disable hyperthreading.
To force the code to run at max number of threads, use: `./run.sh N N`, where `N` is output of `nproc --all`
Sometimes it's faster, sometimes it's worse.

--------------
# Main indeas:
- Unsigned int overflow hashing: cheapest hash method possible.
- SIMD to find multiple separator `;` and loop through them
- SIMD hashing
- SIMD for string comparison in hash table probing
- ILP trick (each thread process 2 different lines at a time)
- Parse number as int instead of float 
- Notice properties of actual data
- + 99% of station names has `length <= 16`, use compiler hint + implement SIMD for this specific case. If length > 16, use a fallback => still meet requirements of `MAX_KEY_LENGTH = 100`
- + `-99.9 <= temperature <= 99.9` guaranteed, use special code using this property
- Use mmap for fast file reading
- Use multithreading for both parsing the file, and aggregating the data
- Other random tricks (intentional ordering of variable assignments)
