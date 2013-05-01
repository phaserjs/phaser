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
            if (substr($value, -3) == '.js')
            {
                $result[] = $value; 
            }
        } 
    } 

    return $result; 
} 

$state = false;

if (isset($_GET['f']))
{
    $js = $_GET['d'] . '/' . $_GET['f'];
    $ts = substr($js, 0, -2) . 'ts';
    $state = substr($_GET['f'], 0, -3);
}

?>
<!DOCTYPE html>

<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="initial-scale=1 maximum-scale=1 user-scalable=0" />
    <title>Phaser Test Runner: <?php echo $state?></title>
    <link rel="stylesheet" href="phaser.css" type="text/css" />
    <script src="phaser.js"></script>
    <script src="phaser-fx.js"></script>
<?php
    if ($state)
    {
?>
    <script src="<?php echo $js?>"></script>
<?php
    }
?>
</head>
<body>

<?php

    if ($state)
    {
?>

    <a href="index.php" class="button star">Home</a>
    <a href="<?php echo $js?>" class="button play">View JavaScript</a>
    <a href="<?php echo $ts?>" class="button play">View TypeScript</a>


    <div id="game"></div>

    <p>You'll learn best from these Tests by viewing the source code.<br />
        Use the arrow keys / mouse to move around most of them.</p>

    <p><a href="https://github.com/photonstorm/phaser">Phaser</a></p>

<?php
    }
?>

<?php

function printJSLinks($dir, $files) {

    foreach ($files as $key => $value) {

        $value2 = substr($value, 0, -3);
        echo "<a href=\"index.php?f=$value&amp;d=$dir\" class=\"button\">$value2</a>";

    }

}

if ($state == false)
{
?>

    <div id="header">
        <h1 id="title">Phaser Test Suite</h1>
    </div>

    <div id="links">
<?php
    $files = dirToArray(dirname(__FILE__));

    foreach ($files as $key => $value) {
        
        //  If $key is an array, output it as an h2 or something
        if (is_array($value) && count($value) > 0)
        {
            echo "<h2>$key (" . count($value) . " examples)</h2>";
            printJSLinks($key, $value);
        }

    }
?>
</div>
<?php
}
?>

</body>
</html>