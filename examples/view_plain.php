<?php
    require('funcs.php');

    getFile();
?>
<!doctype html>
<html>
<head>
	<meta charset="UTF-8" />
	<title><?php echo $title?></title>
	<?php
		require('phaser-debug-js.php');
	?>
	<script src="<?php echo $filename?>"></script>
	<style>
		body {
			margin: 0;
			padding: 0;
		}
	</style>
</head>
<body>

<div id="phaser-example"></div>

</body>
</html>