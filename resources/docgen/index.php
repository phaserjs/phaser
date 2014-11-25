<!doctype html>
<html>
    <head>
        <meta charset="UTF-8" />
        <title>Phaser Documentation Viewer</title>
        <style type="text/css">
            body {
                font-family: Arial;
                font-size: 14px;
                background-color: #fff;
                color: #000;
            }

            textarea {
                width: 100%;
                height: 1000px;
            }
        </style>
    </head>
    <body>

    <a href="export.php">Export</a>

<?php
    // http://uk1.php.net/manual/en/class.splfileinfo.php

    function dirToArray($dir) { 

        global $src;

        $ignore = array('.', '..');
        $fileIgnore = array('p2.js');
        $result = array(); 
        $root = scandir($dir); 
        $dirs = array_diff($root, $ignore);

        foreach ($dirs as $key => $value) 
        { 
            $path = realpath($dir . DIRECTORY_SEPARATOR . $value);

            if (is_dir($path)) 
            {
                $result[$value] = dirToArray($path); 
            } 
            else 
            {
                if (substr($value, -3) == '.js')
                {
                    if (!in_array($value, $fileIgnore))
                    {
                        $index = str_replace($src, "", $path);
                        $index = substr($index, 1);

                        $result[substr($value, 0, -3)] = $index;
                    }
                }
            } 
        } 

        return $result; 
    }

    function displaySection($title, $files) {

        if ($title === "")
        {
            echo "<h1>Phaser v2.1.1</h1>";
        }
        else
        {
            echo "<h2>$title</h2>";
        }

        echo "<ul>";

        foreach ($files as $name => $file)
        {
            if (is_array($file))
            {
                displaySection($name, $file);
            }
            else
            {
                echo "<li><a href=\"view.php?src=$file\">$name</a>";
                // echo " &nbsp;&nbsp; [ <a href=\"export.php?src=$file\">json</a> ]</li>";
                echo " &nbsp;&nbsp; [ <a href=\"json.php?src=$file\">json</a> ]</li>";
            }
        }

        echo "</ul>";

    }

    $src = realpath('../src');

    $files = dirToArray($src);

    displaySection("", $files);

    // echo "<pre>";
    // var_dump($src);
    // print_r($files);
    // echo "</pre>";

?>

</body>
</html>