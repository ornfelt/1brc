#! /usr/bin/env perl

use Modern::Perl '2015';
use List::Util qw/min max sum/;
use Text::CSV_XS;
###
use utf8;
binmode(STDOUT, ':encoding(UTF-8)');
binmode(STDIN, ':encoding(UTF-8)');
my $debug= 0;
my $file =$debug?"test.txt": "measurements.txt";

my $csv = Text::CSV_XS->new ({ binary => 1, auto_diag => 1 , sep_char => ";" });
open my $fh, "<:encoding(utf8)", $file or die "can't open $file: $!";

my $Data;
while (my $row = $csv->getline ($fh)) {

    my ( $city, $temp ) = @$row;

    if ($Data->{$city}) {
	
	if ($temp > $Data->{$city}{max}) {
	    $Data->{$city}{max} = $temp
	} elsif ($temp < $Data->{$city}{min}) {
	    $Data->{$city}{min} = $temp
	}
	
	$Data->{$city}{sum} = $Data->{$city}{sum}+=$temp;
	$Data->{$city}{count}++;
		   
	    
    } else {

	# initialize city
	$Data->{$city} = {min=>$temp, max=>$temp ,sum=>$temp, count=>1};
    } 
}
close $fh;

my @results;
for my $city (sort {$a cmp $b} keys %$Data){
    my $avg = $Data->{$city}{sum}/$Data->{$city}{count};
    push @results, "$city=".join('/', map {sprintf("%.1f", $_)} ($Data->{$city}{min}, $avg, $Data->{$city}{max}));
   
}
say '{'.join(', ',@results).'}';

