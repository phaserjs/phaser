<?php
    if (isset($_GET['src']))
    {
        $src = $_GET['src'];
    }

    require 'src/Block.php';
    require 'src/ClassDesc.php';
    require 'src/Constant.php';
    require 'src/Method.php';
    require 'src/Parameter.php';
    require 'src/Property.php';
    require 'src/ReturnType.php';
    require 'src/Processor.php';
    require 'src/PhaserDocGen.php';

    header('Content-Type: application/json');

    $gen = new PhaserDocGen();
    $gen->start();

    $obj = $gen->get($src);
    $obj->extend();

    echo $obj->getJSON();
?>