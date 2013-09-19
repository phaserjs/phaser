<a href="http://yui.2clics.net/">Minify it</a><br />

<textarea style="width: 800px; height: 800px">
<?php
	//	Get the version number
	//	VERSION: '1.0.5', 
	$vf = file_get_contents('../src/Phaser.js');
	$version = substr($vf, strpos($vf, 'VERSION: ') + 10, 5);

	echo "Building version $version \n\n";

	$js = file('../examples/js.php');
	$output = "";

	for ($i = 0; $i < count($js); $i++)
	{
		//	<script src="../src/Phaser.js"></script>		
		$line = trim($js[$i]);

		if (strpos($line, '<script') !== false)
		{
			$line = str_replace('<script src="', '', $line);
			$line = str_replace('"></script>', '', $line);
			$filename = substr($line, strrpos($line, '/') + 1);

			echo $line . "\n";
			// echo $filename . "\n";

			//	Read the file in
			$source = file_get_contents($line);

			if ($filename == 'Intro.js')
			{
				//	Built at: {buildDate}
				$source = str_replace('{buildDate}', date('r'), $source);

				//	{version}
				$source = str_replace('{version}', $version, $source);
			}

			$output .= $source . "\n";
		}
	}

	//echo $output;

	file_put_contents('phaser.js', $output);

?>
</textarea>