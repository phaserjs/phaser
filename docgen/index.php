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

<?php
    // http://uk1.php.net/manual/en/class.splfileinfo.php

    function dirToArray($dir) { 

        // $ignore = array('.', '..', 'pixi');
        $ignore = array('.', '..');
        $fileIgnore = array('p2.js');
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
                if (substr($value, -3) == '.js')
                {
                    if (!in_array($value, $fileIgnore))
                    {
                        $result[] = substr($value, 0, -3);
                    }
                }
            } 
        } 

        return $result; 
    }

    function displaySection($title, $files, $parent = "") {

        if ($title === "")
        {
            echo "<h1>Phaser v2.1.1</h1>";
        }
        else
        {
            echo "<h2>$title</h2>";
        }

        echo "<ul>";

        foreach ($files as $key => $file)
        {
            if (is_array($file))
            {
                displaySection($key, $file, $title);
            }
            else
            {
                $src = $title . "/" . $file;

                if ($parent !== "")
                {
                    $src = $parent . "/" . $src;
                }

                echo "<li><a href=\"view.php?src=$src\">$file</a></li>";
            }
        }

        echo "</ul>";

    }

    $path = realpath('../src');
    $files = dirToArray($path);

    displaySection("", $files, "");

    // echo "<pre>";
    // print_r($files);
    // echo "</pre>";

?>

</body>
</html>