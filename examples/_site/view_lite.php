<?php
    require('funcs.php');

    getFile();
?>
<!doctype html>
<html>
<head>
	<meta charset="UTF-8" />
	<title>phaser - <?php echo $title?></title>
	<?php
		require('phaser-debug-js.php');
	?>
	<script src="https://google-code-prettify.googlecode.com/svn/loader/run_prettify.js"></script>
	<script src="<?php echo $filename?>"></script>
</head>
<body>

<div id="phaser-example"></div>

<pre class="prettyprint">
<?php
	echo $code;
?>
</pre>

</body>
</html>