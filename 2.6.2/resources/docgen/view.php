<?php

    $src = "loader/Cache.js";
    $method = null;
    $property = null;

    if (isset($_GET['src']))
    {
        $src = $_GET['src'];
    }

    if (isset($_GET['method']))
    {
        $method = $_GET['method'];
    }

    if (isset($_GET['property']))
    {
        $property = $_GET['property'];
    }

    require 'src/Block.php';
    require 'src/ClassDesc.php';
    require 'src/Constant.php';
    require 'src/Method.php';
    require 'src/Parameter.php';
    require 'src/Property.php';
    require 'src/ReturnType.php';
    require 'src/Processor.php';

    $data = new Processor(null, "../src/$src");
?>
<!doctype html>
<html>
    <head>
        <meta charset="UTF-8" />
        <title>Phaser Documentation Viewer: <?php echo $src ?></title>
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

    <a href="index.php">Index</a>

    <h1><?php echo $src ?></h1>

<?php
    echo "<pre>";
    print_r($data->getLog());
    echo "</pre>";

    echo "<pre>";
    print_r($data->class->getArray());
    echo "</pre>";

    if ($method)
    {
        echo "<pre>";
        print_r($data->methods[$method]->getArray());
        echo "</pre>";
    }

    if ($property)
    {
        echo "<pre>";
        print_r($data->properties[$property]->getArray());
        echo "</pre>";
    }
?>

    <h2>Constants</h2>

    <ul>
<?php
    foreach ($data->consts as $constName => $const)
    {
       echo "<li>{$const->name}</li>";
    }
?>
    </ul>

    <h2>Methods</h2>

    <h3>Public</h3>
    <ul>
<?php
    foreach ($data->methods['public'] as $methodName => $method)
    {
        echo "<li><a href=\"view.php?src=$src&amp;method={$method->name}\">{$method->name}</a></li>";
    }
?>
    </ul>

    <h3>Protected</h3>
    <ul>
<?php
    foreach ($data->methods['protected'] as $methodName => $method)
    {
        echo "<li><a href=\"view.php?src=$src&amp;method={$method->name}\">{$method->name}</a></li>";
    }
?>
    </ul>

    <h3>Private</h3>
    <ul>
<?php
    foreach ($data->methods['private'] as $methodName => $method)
    {
        echo "<li><a href=\"view.php?src=$src&amp;method={$method->name}\">{$method->name}</a></li>";
    }
?>
    </ul>

    <h3>Static</h3>
    <ul>
<?php
    foreach ($data->methods['static'] as $methodName => $method)
    {
        echo "<li><a href=\"view.php?src=$src&amp;method={$method->name}\">{$method->name}</a></li>";
    }
?>
    </ul>

    <h2>Properties</h2>

    <h3>Public</h3>
    <ul>
<?php
    foreach ($data->properties['public'] as $propertyName => $property)
    {
        echo "<li><a href=\"view.php?src=$src&amp;property={$property->name}\">{$property->name}</a></li>";
    }
?>
    </ul>

    <h3>Protected</h3>
    <ul>
<?php
    foreach ($data->properties['protected'] as $propertyName => $property)
    {
        echo "<li><a href=\"view.php?src=$src&amp;property={$property->name}\">{$property->name}</a></li>";
    }
?>
    </ul>

    <h3>Private</h3>
    <ul>
<?php
    foreach ($data->properties['private'] as $propertyName => $property)
    {
        echo "<li><a href=\"view.php?src=$src&amp;property={$property->name}\">{$property->name}</a></li>";
    }
?>
    </ul>


</body>
</html>