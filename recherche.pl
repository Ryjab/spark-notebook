use strict;
use warnings;
use open ':std',':encoding(UTF-8)';

my $fh;
my $file='texte.txt';
my $occurence = <>;
chomp $occurence;
open($fh,'<',$file) or die "impossible d'ouvrir le fichier $file";
my @retour;
my $i;
while(my $line = <$fh>)
{	
	if(index($line,$occurence)==1)
	{
		$line = reverse($line);
		chop($line);
		$line = reverse($line);
		
		for($i=0;index($line,'#') || $i==999;$i++)
		{
			$retour[$i] = $line;
			$line = <$fh>;
		}
	}
}
foreach(@retour)
{
	print "$_";
}