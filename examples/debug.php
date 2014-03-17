<?php
    $files = dirToArray(dirname(__FILE__));
    $total = 0;

    foreach ($files as $key => $value)
    {
        if (is_array($value) && count($value) > 0)
        {
            $total += count($value);
        }
    }

    function dirToArray($dir) { 

        $ignore = array('.', '..', '_site', 'assets', 'states', 'book', 'filters');
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

    function printJSLinks($section) {

        global $files;

        $output = "";

        if ($section)
        {
            $tempFiles = $files[$section];
        }
        else
        {
            $tempFiles = $files;
        }

        foreach ($tempFiles as $key => $value)
        {
            if (is_array($value)) 
            {
                $output .= "<optgroup label=\"$key\">";
                $output .= printJSLinks($key);
                $output .= "</optgroup>";
            } 
            else 
            {
                $value2 = substr($value, 0, -3);
                $file = urlencode($value);
                $output .= "<option value=\"$section/$file\">$value2</option>";
            } 
        }

        return $output;

    }
?>
<!doctype html>
<html>
    <head>
        <meta charset="UTF-8" />
        <title>phaser</title>
        <script src="_site/js/jquery-2.0.3.min.js" type="text/javascript"></script>
        <?php
            require('../build/config.php');
        ?>
        <style>
            body {
                font-family: Arial;
                font-size: 14px;
            }

            input {
                font-size: 18px;
            }
        </style>
    </head>
    <body>

        <div id="phaser-example"></div>

        <input type="button" id="start" value="start" />
        <input type="button" id="stop" value="stop" style="margin-left: 32px" />
        <input type="button" id="step" value="step" style="margin-left: 128px"/>

        <h2>Debug</h2>

        <select id="filelist">
        <?php
            echo printJSLinks(false);
        ?>
        </select>

        <script type="text/javascript">
            
            $("#filelist").change(function() {
                window.location.href = 'debug.php?f=' + $("#filelist").val();
            });

            var debugSprite = null;

            <?php
                if (isset($_GET['f']))
                {
                    $src = file_get_contents($_GET['f']);
                    echo $src;
                }
            ?>

            $('#step').click(function(){
                console.log('---- STEP', game.stepCount, '-------------------------------');
                game.step();
            });

            $('#start').click(function(){
                console.log('---- START DEBUGGING -------------------------------');

                game.enableStep();

                if (debugSprite)
                {
                    debugSprite.debug = true;
                }
            });

            $('#stop').click(function(){
                console.log('---- STOP DEBUGGING -------------------------------');

                game.disableStep();

                if (debugSprite)
                {
                    debugSprite.debug = false;
                }
            });

        </script>

    </body>
</html>