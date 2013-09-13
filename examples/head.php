<!DOCTYPE HTML>
<html>
<head>
	<meta charset="UTF-8" />
	<title>phaser - <?php echo $title?></title>
	<base href="../">
	<?php
		require('js.php');

		if (isset($mobile))
		{
	?>
    <meta name="viewport" content="initial-scale=1 maximum-scale=1 user-scalable=0" />
	<?php
		}
	?>
</head>
<body>
