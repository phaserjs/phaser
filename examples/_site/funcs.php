<?php

    //  Global
    $files = dirToArray(dirname(__FILE__));
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

        $ignore = array('.', '..', 'html', 'assets', 'states');
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