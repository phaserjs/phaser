<?php
    if (isset($_GET['src']))
    {
        $srcfile = $_GET['src'];
    }
    else
    {
        $srcfile = "loader/Cache";
    }

    require 'src/Block.php';
    require 'src/ClassDesc.php';
    require 'src/Constant.php';
    require 'src/Method.php';
    require 'src/Parameter.php';
    require 'src/Property.php';
    require 'src/ReturnType.php';
    require 'src/Processor.php';

    $data = new Processor("../src/" . $srcfile . ".js");
?>
<!doctype html>
<html>
    <head>
        <meta charset="UTF-8" />
        <title>Phaser Documentation Viewer: <?php echo $srcfile ?></title>
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

    <h1><?php echo $srcfile ?></h1>

    <h2>Constants</h2>

    <ul>
<?php
    for ($i = 0; $i < count($data->consts); $i++)
    {
       $const = $data->consts[$i];
       echo "<li>{$const->name}</li>";
    }
?>
    </ul>

    <h2>Methods</h2>

    <ul>
<?php
    for ($i = 0; $i < count($data->methods); $i++)
    {
        $method = $data->methods[$i];
        echo "<li>{$method->name}</li>";
    }
?>
    </ul>

    <h2>Properties</h2>

    <ul>
<?php
    for ($i = 0; $i < count($data->properties); $i++)
    {
        $property = $data->properties[$i];
        echo "<li>{$property->name}</li>";
    }
?>
    </ul>

</body>
</html>