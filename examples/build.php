<?php
	require('funcs.php');
?>
<html lang='en' xml:lang='en' xmlns='http://www.w3.org/1999/xhtml'>
<head>
	<meta content='text/html; charset=utf-8' http-equiv='Content-Type'>
</head>
<body>

<textarea style="width: 800px; height: 800px">
<?php
	$output = "{\n";

	foreach ($files as $key => $value)
	{
		if (is_array($value) && count($value) > 0)
		{
			$output .= "\"$key\": [\n";

			$output .= printJSLinks($key, $value, 'json');

			$output .= "],\n";
		}
	}

    $output = rtrim($output);
    $output = substr($output, 0, -1);
    $output .= "\n}";

	echo $output;

	file_put_contents('examples.json', $output);
?>
</textarea>

</body>
</html>