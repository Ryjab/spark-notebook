use strict;
use warnings;

my $fh;
my $fh2;
my $fh3;
open($fh,'<','bibli.txt') or die "impossible d'ouvrir le fichier bibli.txt";
open($fh2,'>','source.txt') or die "impossible d'ouvrir le fichier bibli.txt";
while(my $ligne=<$fh>)
{
	chomp $ligne;
	open($fh3,'<',$ligne) or die "impossible d'ouvrir le fichier $ligne";
	while(my $ligne2=<$fh3>)
	{
		print $fh2 $ligne2;
	}
	print $fh2 "\n\n\n--------------------------------------------------------------------------------------\n\n\n";
	close($fh3);
}
close($fh);
close($fh2);