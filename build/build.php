<textarea style="width: 800px; height: 800px">
<?php
	
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

			echo $line . "\n";

			//	Read the file in
			$source = file_get_contents($line);

			if ($i == 4)
			{
				//	Built at: {buildDate}
				$source = str_replace('{buildDate}', date('r'), $source);
			}

			$output .= $source . "\n";
		}
	}

	//echo $output;

	file_put_contents('phaser.js', $output);

?>
</textarea>