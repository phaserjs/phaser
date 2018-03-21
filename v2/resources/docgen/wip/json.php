<?php
    require 'src/Block.php';
    require 'src/ClassDesc.php';
    require 'src/Constant.php';
    require 'src/Method.php';
    require 'src/Parameter.php';
    require 'src/Property.php';
    require 'src/ReturnType.php';
    require 'src/Processor.php';

    // $data = new Processor("../src/gameobjects/Sprite.js");
    $data = new Processor("../src/loader/Cache.js");
    
    header('Content-Type: application/json');

    $raw = [];
    
    $raw['consts'] = $data->getConstsArray();

    echo json_encode($raw);
    
//    echo $data->consts[0]->getJSON();
    

?>