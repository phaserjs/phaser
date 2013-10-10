<?php
	date_default_timezone_set('Europe/London');

	//	Get the version number
	//	VERSION: '1.0.5', 
	$vf = file_get_contents(dirname(__FILE__) . '/../src/Phaser.js');
	$version = substr($vf, strpos($vf, 'VERSION: ') + 10, 5);
	$buildLog = "Building version $version \n\n";
	$header = "";

	$js = file(dirname(__FILE__) . '/../examples/js.php');
	$output = "";

	for ($i = 0; $i < count($js); $i++)
	{
		//	<script src="../src/Phaser.js"></script>		
		$line = trim($js[$i]);

		if (strpos($line, '<script') !== false)
		{
			$line = str_replace('<script src="', '', $line);
			$line = dirname(__FILE__) . DIRECTORY_SEPARATOR . str_replace('"></script>', '', $line);
			$filename = substr($line, strrpos($line, '/') + 1);

			$buildLog .= $line . "\n";
			// echo $filename . "\n";

			//	Read the file in
			if (file_exists($line))
			{
				$source = file_get_contents($line);

				if ($filename == 'Intro.js')
				{
					//	Built at: {buildDate}
					$source = str_replace('{buildDate}', date('r'), $source);

					//	{version}
					$source = str_replace('{version}', $version, $source);

					// Set the header
					$header = $source;
				}
				else
				{
					$output .= $source . "\n";
				}
			}
		}
	}

	// Create a UMD wrapper, to allow Phaser to be exposed to AMD, Node and Browsers
	$template = <<<EOT
%s(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.Phaser = factory();
    }
}(this, function (b) {
%s
    return Phaser;
}));
EOT;

	file_put_contents(dirname(__FILE__) . DIRECTORY_SEPARATOR . 'phaser.js', sprintf($template, $header, $output));

	if(php_sapi_name() == 'cli' || empty($_SERVER['REMOTE_ADDR'])) {
	  echo "\ndone\n\n";
	  return;
	}
?>
<a href="http://yui.2clics.net/">Minify it</a><br />

<textarea style="width: 800px; height: 800px">
<?php echo $buildLog; ?>
</textarea>