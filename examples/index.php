<?php
    function dirToArray($dir) { 

        $ignore = array('.', '..', 'Tests.csproj', 'Tests.csproj.user', 'bin', 'index.php', 'phaser.css', 'obj', 'assets', 'states', 'Phaser Tests.sublime-project');
        $result = array(); 
        $root = scandir($dir); 
        $dirs = array_diff($root, $ignore);

        foreach ($dirs as $key => $value) 
        { 
            if (is_dir($dir . DIRECTORY_SEPARATOR . $value)) 
            { 
                $result[$value] = dirToArray($dir . DIRECTORY_SEPARATOR . $value); 
            } 
            else 
            {
                if (substr($value, -4) == '.php')
                {
                    $result[] = $value; 
                }
            } 
        } 

        return $result; 
    } 

    function printJSLinks($dir, $files) {

        foreach ($files as $key => $value)
        {
            $value2 = substr($value, 0, -4);
            echo "<a href=\"$dir/$value\" class=\"button\">$value2</a>";
        }

    }

    $files = dirToArray(dirname(__FILE__));
    $total = 0;

    foreach ($files as $key => $value)
    {
        if (is_array($value) && count($value) > 0)
        {
            $total += count($value);
        }
    }
?>
<!DOCTYPE HTML>
<head>
    <meta charset="utf-8" />
    <title>Phaser Examples</title>
    <link rel="stylesheet" href="phaser.css" type="text/css" />
</head>
<body>

    <div id="header">
        <h1 id="title">Phaser Test Suite</h1>
    </div>

    <div id="links">

    <?php
        echo "<h2>Total Tests: $total </h2>";

        foreach ($files as $key => $value)
        {
            //  If $key is an array, output it as an h2 or something
            if (is_array($value) && count($value) > 0)
            {
                echo "<h2>$key (" . count($value) . " examples)</h2>";
                printJSLinks($key, $value);
            }

        }
    ?>
    </div>

</body>
</html>