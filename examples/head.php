<!doctype html>
<html>
<head>
	<meta charset="UTF-8" />
	<title>phaser - <?php echo $title?></title>
	<base href="../">
	<?php
		require('js.php');

		if (isset($mobile))
		{
			echo '    <meta name="viewport" content="initial-scale=1 maximum-scale=1 user-scalable=0" />';
		}

		if (isset($css))
		{
			echo "    <style>$css</style>";
		}
	?>
</head>
<body>
