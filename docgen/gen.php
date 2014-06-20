<!doctype html>
<html>
    <head>
        <meta charset="UTF-8" />
        <title>phaser doc gen</title>
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

    <textarea spellcheck="false">
<?php

    class Block
    {
        public $start = 0;
        public $end = 0;
        public $code = '';
        public $content;

        public $isProperty = false;
        public $isMethod = false;

        public function __construct($start, $end, $code, $content)
        {
            $this->start = $start;
            $this->end = $end;
            $this->code = $code;
            $this->content = $content;

            // preg_match("/(@.*){(\S*)}(.*) -(.*)/", $input_line, $output_array);
            // this one captures a property even with a * at the start

            $this->isProperty = $this->getTypeBoolean('@property');
            $this->isMethod = $this->getTypeBoolean('@method');
        }

        public function getTypeBoolean($scan)
        {
            for ($i = 0; $i < count($this->content); $i++)
            {
                preg_match("/(@\w*)/", $this->content[$i], $output);

                if ($output && $output[0] === $scan)
                {
                    return true;
                }
            }

            return false;
        }

        public function getLine($scan)
        {
            $i = $this->getContentIndex($scan);

            if ($i > -1)
            {
                return $this->content[$i];
            }
        }

        public function getContentIndex($scan)
        {
            for ($i = 0; $i < count($this->content); $i++)
            {
                preg_match("/(@\w*)/", $this->content[$i], $output);

                if ($output && $output[0] === $scan)
                {
                    return $i;
                }
            }

            return -1;
        }

    }

    class Property
    {
        public $line; // number, line number in the source file this is found on?
        public $name; // visible, name, parent
        public $types = []; // an array containing all possible types it can be: string, number, etc
        public $default = false; // assigned value is the default value
        public $help = '';
        public $inlineHelp = '';

        public $isPublic = true;
        public $isProtected = false;
        public $isPrivate = false;

        public function __construct($block)
        {
            //  Because zero offset + allowing for final line
            $this->line = $block->end + 2;

            preg_match("/(@.*){(\S*)} (\S*)( - ?)?(.*)/", $block->getLine('@property'), $output);

            $this->types = explode('|', $output[2]);
            $this->name = $output[3];
            $this->inlineHelp = $output[5];

            if ($block->getTypeBoolean('@protected'))
            {
                $this->isPublic = false;
                $this->isProtected = true;
            }
            else if ($block->getTypeBoolean('@private'))
            {
                $this->isPublic = false;
                $this->isPrivate = true;
            }

            //  Default?
            if ($block->getTypeBoolean('@default'))
            {
                preg_match("/= (.*);/", $block->code, $defaultType);
                if ($defaultType && isset($defaultType[1]))
                {
                    $this->default = $defaultType[1];
                }
            }

        }

    }

    function createProperty($block)
    {
        global $properties;

        /**
        * @property {number} type - The const type of this object.
        * @readonly
        */
    
        /**
        * @property {number} z - The z-depth value of this object within its Group (remember the World is a Group as well). No two objects in a Group can have the same z value.
        */
    
        /**
        *  @property {string|Phaser.RenderTexture|Phaser.BitmapData|PIXI.Texture} key - This is the image or texture used by the Sprite during rendering. It can be a string which is a reference to the Cache entry, or an instance of a RenderTexture, BitmapData or PIXI.Texture.
        */

        /**
        * Should this Sprite be automatically culled if out of range of the camera?
        * A culled sprite has its renderable property set to 'false'.
        * Be advised this is quite an expensive operation, as it has to calculate the bounds of the object every frame, so only enable it if you really need it.
        *
        * @property {boolean} autoCull - A flag indicating if the Sprite should be automatically camera culled or not.
        * @default
        */
       
        /**
        * By default Sprites won't add themselves to any physics system and their physics body will be `null`.
        * To enable them for physics you need to call `game.physics.enable(sprite, system)` where `sprite` is this object
        * and `system` is the Physics system you want to use to manage this body. Once enabled you can access all physics related properties via `Sprite.body`.
        *
        * Important: Enabling a Sprite for P2 or Ninja physics will automatically set `Sprite.anchor` to 0.5 so the physics body is centered on the Sprite.
        * If you need a different result then adjust or re-create the Body shape offsets manually, and/or reset the anchor after enabling physics.
        *
        * @property {Phaser.Physics.Arcade.Body|Phaser.Physics.P2.Body|Phaser.Physics.Ninja.Body|null} body
        * @default
        */

        $p = new Property();

        $valueLine = $block[isProperty($block)];



    }

    $blocks = [];
    $properties = [];
    $methods = [];

    $file = "../src/gameobjects/Sprite.js";

    $js = file($file);

    $scanningForOpen = true;
    $scanningForClose = false;

    $openLine = 0;
    $closeLine = 0;
    $chunk = [];

    for ($i = 0; $i < count($js); $i++)
    {
        $line = trim($js[$i]);

        if ($scanningForOpen && $line === "/**")
        {
            $scanningForOpen = false;
            $scanningForClose = true;
            $chunk = [];
            $openLine = $i;
        }

        if ($scanningForClose && $line === "*/")
        {
            $scanningForOpen = true;
            $scanningForClose = false;
            $closeLine = $i;

            //  The first element is always the opening /** so remove it
            array_shift($chunk);

            $blocks[] = new Block($openLine, $closeLine, $js[$i + 1], $chunk);
        }
        else
        {
            $chunk[] = $line;
        }
    }

    //  That's the whole file scanned, how many blocks did we get out of it?
    echo count($blocks) . " blocks found\n\n";

    echo "Properties:\n\n";


    for ($i = 0; $i < count($blocks); $i++)
    {
        if ($blocks[$i]->isProperty)
        {
            //  First things first - we know it's a property

            echo "\n\n";

            $property = new Property($blocks[$i]);

            echo $property->name . "\n";

            // print_r($property->types);

            echo "Source code line " . $property->line . "\n";
            echo "Default: " . $property->default . "\n";

            echo "\n\n";

            // echo $blocks[$i]->start . "\n";
        }
    }

    /*
    echo "\nMethods:\n\n";

    for ($i = 0; $i < count($blocks); $i++)
    {
        if ($blocks[$i]->isMethod)
        {
            echo $blocks[$i]->start . "\n";
        }
    }
    */
?>
    </textarea>

</body>
</html>