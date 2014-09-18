<?php
    require 'src/Block.php';
    require 'src/ClassDesc.php';
    require 'src/Constant.php';
    require 'src/Method.php';
    require 'src/Parameter.php';
    require 'src/Property.php';
    require 'src/ReturnType.php';
    require 'src/Processor.php';
    require 'src/PhaserDocGen.php';
?>
<!doctype html>
<html>
    <head>
        <meta charset="UTF-8" />
        <title>Phaser Documentation Generator</title>
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

    <pre>
<?php
    $gen = new PhaserDocGen();
    $gen->start();

    foreach ($gen->classes as $key => $processor)
    {
        echo $key . "\n";
    }

    // print_r($gen->classes);

    // $gen->extend();
?>
    </pre>

</body>
</html>