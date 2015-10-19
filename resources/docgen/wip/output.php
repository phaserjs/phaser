<?php
    require 'src/Block.php';
    require 'src/ClassDesc.php';
    require 'src/Constant.php';
    require 'src/Method.php';
    require 'src/Parameter.php';
    require 'src/Property.php';
    require 'src/ReturnType.php';
    require 'src/Processor.php';

    header('Content-Type: application/json');

    // $data = new Processor("../src/gameobjects/Sprite.js");
    $data = new Processor("../src/loader/Cache.js");
    
    // echo $data->total() . " blocks found\n\n";
    // echo "\nConstants:\n\n";

    for ($i = 0; $i < count($data->consts); $i++)
    {
        // echo $data->consts[$i]->getJSON() . ",";
    }

/*
    echo "\nMethods:\n\n";

    for ($i = 0; $i < count($data->methods); $i++)
    {
        $method = $data->methods[$i];
        echo "\n\n";
        echo $method->name;
        echo "\n";
        print_r($method->help);
        print_r($method->parameters);
        print_r($method->returns);
    }

    echo "\nProperties:\n\n";

    for ($i = 0; $i < count($data->properties); $i++)
    {
        $property = $data->properties[$i];
        echo "\n\n";
        echo $property->name . "\n";
        // print_r($property->types);
        echo "Source code line " . $property->line . "\n";
        echo "Default: " . $property->default . "\n";
        echo "Help: " . "\n";
        print_r($property->help);
        echo "\n\n";
    }
*/
?>