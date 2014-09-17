<?php
    $src = "loader/Cache.js";

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

    $data = new Processor("../src/$src");

    header('Content-Type: application/json');

    echo $data->getJSON();
?>