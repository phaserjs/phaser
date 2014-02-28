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
        <meta name="viewport" content="initial-scale=1 maximum-scale=1 user-scalable=0 minimal-ui" />
        <title>phaser</title>
        <base href="../" />
        <script src="_site/js/jquery-2.0.3.min.js" type="text/javascript"></script>
        <?php
            require('../../build/config.php');

            if (isset($_GET['f']))
            {
                $f = $_GET['f'];
        ?>
        <script src="wip/<?php echo $f?>" type="text/javascript"></script>
        <?php
            }
        ?>
        <style>
            body {
                margin: 0;
                padding: 0;
                font-family: Arial;
                font-size: 14px;
            }

            #phaser-example {
                position: absolute;
                top: 0;
                left: 0;
            }
        </style>
    </head>
    <body>

        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce ullamcorper ornare sagittis. Donec eleifend pulvinar velit nec convallis. Vestibulum vitae elit dui. Donec eu tincidunt sem. Duis lectus mi, bibendum sed nunc lobortis, tincidunt sollicitudin lectus. Aliquam erat volutpat. Aliquam a lectus sed tellus sodales tempus. Suspendisse potenti. Phasellus augue nisl, placerat vel sem vel, suscipit elementum neque. Vivamus tempor vestibulum eros, vitae mattis lectus aliquet ut. Curabitur interdum, nibh quis molestie placerat, augue ipsum commodo tortor, sed blandit est augue sit amet sapien. Ut vel consequat tellus. Aenean et vulputate sapien. Praesent rutrum elementum elit ut tempor. Aliquam erat volutpat. Fusce fermentum tincidunt est non vulputate.</p>

<p>In aliquam sed nulla id luctus. Donec ut nibh massa. Nullam aliquam feugiat urna, nec ultricies risus vulputate at. Fusce scelerisque ligula vel urna porta, nec aliquam leo facilisis. Duis accumsan nibh vestibulum, venenatis enim sit amet, condimentum sapien. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Ut auctor diam id mi porta, vestibulum pulvinar nibh sollicitudin. Curabitur ullamcorper lorem id lorem commodo, non ornare enim placerat. In vitae nisl lectus. Pellentesque eget neque sed ligula blandit porttitor vitae ut nibh. Nulla facilisi. Nunc ac erat viverra leo bibendum volutpat ut eu justo. Fusce a mollis purus. Phasellus consectetur vehicula ligula vel vestibulum. Suspendisse at dui vel ligula convallis lobortis at et tellus.</p>

<p>Nullam aliquam erat eros, sit amet faucibus tortor iaculis ut. Sed ullamcorper dui sed dolor rutrum tincidunt. Ut sed faucibus mauris, non porta tellus. Nam ultricies vel leo eget rutrum. Sed sit amet pretium risus. Nunc ut sapien eget elit ultrices pretium quis sed justo. Donec a est vitae justo vestibulum porta. Ut interdum pharetra quam id tempor. Sed egestas placerat quam, quis ullamcorper dolor ornare non. Nulla et porttitor neque, a congue nisl. Maecenas vitae elit pretium odio euismod rhoncus. Nulla turpis libero, fermentum quis aliquet et, ultrices nec mi.</p>

<p>Etiam vulputate, elit eu aliquet sagittis, sapien mi cursus nisi, vel mattis orci tortor non velit. Integer nisi dolor, posuere nec elit vitae, porttitor semper velit. Suspendisse sapien augue, lobortis sit amet dolor at, ornare porttitor metus. Proin venenatis ante nec augue volutpat dapibus. Sed interdum augue urna, id feugiat metus feugiat nec. In sed massa nisi. Donec iaculis nisi nulla, a pulvinar nisi dictum tristique. Nunc non erat enim. Proin consequat dolor nec leo gravida aliquet. Nulla non mollis turpis. Curabitur mollis tortor id elementum molestie. Maecenas eleifend et quam eget pellentesque.</p>

<p>Integer ac hendrerit lorem. Nulla laoreet enim eget sem placerat, quis sagittis augue egestas. Ut porttitor purus rhoncus arcu dictum, id condimentum eros fringilla. Donec odio odio, lacinia sed ligula sit amet, viverra scelerisque libero. Curabitur pellentesque nulla mattis, egestas nibh non, viverra eros. Nullam volutpat lectus erat, quis luctus dui lobortis sit amet. Aenean ornare at sem vel pretium. Sed eu euismod nibh. Donec sed venenatis tortor.</p>

        <div id="phaser-example"></div>

        <input type="button" id="step" value="step" />
        <input type="button" id="start" value="start" style="margin-left: 32px" />

        <div style="padding: 32px">

        <h2>work in progress examples</h2>

        <?php
            echo printJSLinks('wip', $files);
        ?>

        </div>

    </body>
</html>