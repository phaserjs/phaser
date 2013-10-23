<?php
    //  Global
    // $files = dirToArray(dirname(__FILE__));
    $files = dirToArray('../');
    $total = 0;

    foreach ($files as $key => $value)
    {
        if (is_array($value) && count($value) > 0)
        {
            $total += count($value);
        }
    }

    function getFile() {

        global $files, $dir, $filename, $title, $code;

        if (isset($_GET['d']) && isset($_GET['f']))
        {
            $dir = urldecode($_GET['d']);
            $filename = urldecode($_GET['d']) . '/' . urldecode($_GET['f']);
            $title = urldecode($_GET['t']);

            if (file_exists($filename))
            {
                $code = file_get_contents($filename);
                $files = dirToArray($dir);
            }
        }

    }

    function dirToArray($dir) { 

        $ignore = array('.', '..', '_site', 'assets', 'states', 'wip', 'games', 'basics');
        $result = array(); 
        $root = scandir($dir); 
        $dirs = array_diff($root, $ignore);

        //  We want these 2 to appear top of the list
        array_unshift($dirs, 'basics', 'games');

        foreach ($dirs as $key => $value) 
        { 
            if (is_dir($dir . DIRECTORY_SEPARATOR . $value)) 
            { 
                $result[$value] = dirToArray($dir . DIRECTORY_SEPARATOR . $value); 
            } 
            else 
            {
                if (substr($value, -3) == '.js')
                {
                    $result[] = $value; 
                }
            } 
        } 

        return $result; 
    } 

    function printJSLinks($dir, $files, $target) {

        $output = "";

        foreach ($files as $key => $value)
        {
            $value2 = substr($value, 0, -3);
            $dir = urlencode($dir);
            $file = urlencode($value);
            $title = urlencode($value2);

            if ($target == 'viewer')
            {
                $output .= "          <a href=\"view_lite.php?d=$dir&amp;f=$file&amp;t=$title\" target=\"viewer\">$value2</a></br>\n";
            }
            else if ($target == 'json')
            {
                $output .= "    { \"file\": \"$file\", \"title\": \"$value2\" },\n";
            }
            else
            {
                $output .= "          <li><a href=\"view_full.php?d=$dir&amp;f=$file&amp;t=$title\">$value2</a></li>\n";
            }
        }

        if ($target == 'json')
        {
            $output = rtrim($output);
            $output = substr($output, 0, -1);
            $output .= "\n";
        }

        return $output;

    }

?>
<html lang='en' xml:lang='en' xmlns='http://www.w3.org/1999/xhtml'>
<head>
	<meta content='text/html; charset=utf-8' http-equiv='Content-Type'>
	<title>Phaser Examples JSON Build Script</title>
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