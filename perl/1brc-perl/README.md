# 1brc-perl
1 Billion Record Challenge in Perl

Original challenge for Java: <https://github.com/gunnarmorling/1brc>

To get the full input file, clone that repo according the instructions and run the commands to generate it. It's not included in this repo.

I have included the first 1M rows in the zipped file "test.zip".

The file `result.txt` contains the output of the reference Java application.

### Some numbers

Java reference implementation in the original repo runs in around 3m

Using `cat` to write the file to /dev/null takes ~18s.

### My system


```
$ neofetch
            .-/+oossssoo+/-.               gerikson@nuc 
        `:+ssssssssssssssssss+:`           ------------ 
      -+ssssssssssssssssssyyssss+-         OS: Ubuntu 22.04.3 LTS x86_64 
    .ossssssssssssssssssdMMMNysssso.       Kernel: 6.2.0-39-generic 
   /ssssssssssshdmmNNmmyNMMMMhssssss/      Uptime: 1 day, 8 hours 
  +ssssssssshmydMMMMMMMNddddyssssssss+     
 /sssssssshNMMMyhhyyyyhmNMMMNhssssssss/    
.ssssssssdMMMNhsssssssssshNMMMdssssssss.   
+sssshhhyNMMNyssssssssssssyNMMMysssssss+   
ossyNMMMNyMMhsssssssssssssshmmmhssssssso   
ossyNMMMNyMMhsssssssssssssshmmmhssssssso   
+sssshhhyNMMNyssssssssssssyNMMMysssssss+   
.ssssssssdMMMNhsssssssssshNMMMdssssssss.   
 /sssssssshNMMMyhhyyyyhdNMMMNhssssssss/    
  +sssssssssdmydMMMMMMMMddddyssssssss+     CPU: Intel i7-5557U (4) @ 3.400GHz 
   /ssssssssssshdmNNNNmyNMMMMhssssss/      GPU: Intel Iris Graphics 6100 
    .ossssssssssssssssssdMMMNysssso.       Memory: 1263MiB / 15870MiB 
      -+sssssssssssssssssyyyssss+-
        `:+ssssssssssssssssss+:`                                   
            .-/+oossssoo+/-.                                       

```
