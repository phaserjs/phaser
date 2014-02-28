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

        $ignore = array('.', '..', '_site', 'assets', 'gfx', 'states', 'book', 'filters', 'misc');
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

    function printJSLinks($dir, $files) {

        $output = "";

        foreach ($files as $key => $value)
        {
            $value2 = substr($value, 0, -3);
            $file = urlencode($value);

            $output .= "<a href=\"wip/index.php?f=$file\">$value2</a><br />";
        }

        return $output;

    }
?>
<!doctype html>
<html>
    <head>
        <meta charset="UTF-8" />
        <title>phaser</title>
        <?php
            if (isset($_GET['f']))
            {
                $f = $_GET['f'];
        ?>
        <script src="../../dist/phaser.js" type="text/javascript"></script>
        <script src="<?php echo $f?>" type="text/javascript"></script>
        <?php
            }
        ?>
    </head>
    <body>

        <div id="phaser-example"></div>

    </body>
</html>