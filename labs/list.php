<?php
    //  Global
    $files = dirToArray(dirname(__FILE__) . '/code');
    $files = array_reverse($files);

    $total = 0;
    $demo = '';

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

        $ignore = array('.', '..', 'js', 'src', 'css', 'fonts', 'build', 'examples', 'assets');
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

    function printJSLinks($files) {

        $output = "";

        foreach ($files as $key => $value)
        {
            $value2 = substr($value, 0, -3);
            $file = urlencode($value);

            if ($_SERVER['SERVER_NAME'] == '192.168.0.100')
            {
                $output .= "<a href=\"../labs/view.php?f=$file\"><span data-hover=\"$value2\">$value2</span></a>";
            }
            else
            {
                $output .= "<a href=\"view.php?f=$file\"><span data-hover=\"$value2\">$value2</span></a>";
            }
        }

        return $output;

    }
?>