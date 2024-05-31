#! /usr/bin/env perl

# First naive attempt at this problem. Runs in around 35m on my machine (an Intel NUC).

use Modern::Perl '2015';
use List::Util qw/min max sum/;
use Test::More;
###
use utf8;
binmode(STDOUT, ':encoding(UTF-8)');
binmode(STDIN, ':encoding(UTF-8)');
my $Data;
while (<>) {
    my ( $city, $temp ) = split(/;/, $_ );

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


my @results;
for my $city (sort {$a cmp $b} keys %$Data){
    my $avg = $Data->{$city}{sum}/$Data->{$city}{count};
    my $entry  = "$city=".join('/', map {sprintf("%.1f", $_)} ($Data->{$city}{min}, $avg, $Data->{$city}{max}));

    push @results, $entry;
   
}
say '{'.join(', ',@results).'}';

is(join('|', @results[0..2]),        "Abha=-28.2/18.0/71.3|Abidjan=-24.7/26.0/75.3|Abéché=-23.5/29.4/85.9",          "first 3 ok");
is(join('|', @results[206,207,208]), "London=-34.7/11.3/61.5|Los Angeles=-29.0/18.6/68.2|Louisville=-37.9/13.9/65.3","  mid 3 ok");
is(join('|', @results[-3,-2,-1]),    "Zürich=-46.1/9.3/63.2|Ürümqi=-45.2/7.4/58.2|İzmir=-37.7/17.9/64.4",            " last 3 ok");
done_testing();

