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

    <pre spellcheck="false">
<?php
    class Block
    {
        public $start = 0;
        public $end = 0;
        public $code = '';
        public $content;

        public $isProperty = false;
        public $isMethod = false;
        public $isConst = false;
        public $isClass = false;

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
            $this->isConst = $this->getTypeBoolean('@constant');
            $this->isClass = $this->getTypeBoolean('@class');
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

        public function getLineContent($scan)
        {
            $line = $this->getLine($scan);

            if ($line !== false)
            {
                $pattern = '/.*' . $scan . ' (.*)/';

                preg_match($pattern, $line, $output);

                if ($output)
                {
                    return trim($output[1]);
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
            else
            {
                return false;
            }
        }

        public function getContentIndex($scan, $offset = 0)
        {
            for ($i = $offset; $i < count($this->content); $i++)
            {
                preg_match("/(@\w*)/", $this->content[$i], $output);

                if ($output && $output[0] === $scan)
                {
                    return $i;
                }
            }

            return -1;
        }

        public function getLines($scan)
        {
            $output = [];

            for ($i = 0; $i < count($this->content); $i++)
            {
                preg_match("/(@\w*)/", $this->content[$i], $line);

                if ($line && $line[0] === $scan)
                {
                    $output[] = $this->content[$i];
                }
            }

            return $output;
        }

        public function cleanContent()
        {
            $output = [];

            for ($i = 0; $i < count($this->content); $i++)
            {
                $line = trim($this->content[$i]);

                //  remove * from the start
                if (substr($line, 0, 1) === '*')
                {
                    $line = substr($line, 1);
                    $line = trim($line);
                }

                //  Have we got a @ next?
                if (substr($line, 0, 1) !== '@')
                {
                    $output[] = $line;
                }
            }

            //  Trim off the final element if empty
            if (count($output) > 0 && $output[count($output) - 1] === '')
            {
                array_pop($output);
            }

            return $output;
        }


    }

    class Parameter
    {
        public $name; // rect, copy, etc
        public $types = []; // an array containing all possible types it can be: string, number, etc
        public $help = [];
        public $optional = false;
        public $default = false; // assigned value is the default value

        public function __construct($line)
        {
            preg_match("/.*(@param)\s?{(\S*)} (\S*)( - ?)?(.*)/", $line, $output);

            $this->types = explode('|', $output[2]);
            $this->help = $output[5];

            $name = $output[3];

            if ($name[0] === '[')
            {
                $this->optional = true;
                $name = substr($name, 1, -1);

                //  Default?
                $equals = strpos($name, '=');

                if ($equals > 0)
                {
                    $name = substr($name, 0, $equals - 1);
                    $this->default = substr($name, $equals + 1);
                }
            }

            $this->name = $name;
        }

    }

    //  Because we can't have a class called "Class", grrr...
    class PhaserClass
    {
        public $name; // Phaser.Sprite
        public $parameters = []; // an array containing the parameters
        public $help = [];
        public $extends = '';

        public $hasConstructor = false;
        public $isStatic = false;

        public function __construct($block)
        {
            $this->name = $block->getLineContent('@class');

            $params = $block->getLines('@param');

            for ($i = 0; $i < count($params); $i++)
            {
                $this->parameters[] = new Parameter($params[$i]);
            }

            if ($block->getTypeBoolean('@extends'))
            {
                $this->extends = $block->getLineContent('@extends');
            }

            if ($block->getTypeBoolean('@constructor'))
            {
                $this->hasConstructor = true;
            }
            else
            {
                //  Like Phaser.Math
                $this->isStatic = true;
            }

            //  This is a problem because the @classdesc block is often multi-line, but repeated in the clear content too.
            //  So all the classes probably need tidying up before this part will work correctly.

            // $this->help = $block->cleanContent();

        }

    }

    class Constant
    {
        public $name; // TEXTURE_ATLAS_JSON_ARRAY, PHYSICS_PHASER_JSON, etc
        public $types = []; // an array containing the one single type the const can be
        public $help = [];
        public $line; // number, line number in the source file this is found on?

        public function __construct($block)
        {
            //  Because zero offset + allowing for final line
            $this->line = $block->end + 2;

            //  Phaser.Cache.TEXTURE = 3;
            $name = $block->code;
            $period = strrpos($name, '.');
            $equals = strrpos($name, '=');

            if ($period > 0 && $equals > 0)
            {
                $len = $equals - $period - 1;
                $name = substr($name, $period + 1, $len);
            }
            else if ($period > 0)
            {
                $name = substr($name, $period + 1, -1);
            }

            $this->name = trim($name);

            $line = $block->getLine('@type');

            if ($line && preg_match("/.*@type\s?{(\S*)}/", $line, $output))
            {
                $this->types = explode('|', $output[1]);
            }
        }

    }

    class ReturnType
    {
        public $types = []; // an array containing all possible types it can be: string, number, etc
        public $help = [];

        public function __construct($line)
        {
            if (preg_match("/.*@return\s?{(\S*)} ?(.*)/", $line, $output))
            {
                $this->types = explode('|', $output[1]);
                $this->help = $output[2];
            }
        }

    }

    class Method
    {
        public $line; // number, line number in the source file this is found on?
        public $name; // bringToTop, kill, etc
        public $parameters = []; // an array containing the parameters
        public $help = [];
        public $returns = false;

        public $isPublic = true;
        public $isProtected = false;
        public $isPrivate = false;

        public function __construct($block)
        {
            //  Because zero offset + allowing for final line
            $this->line = $block->end + 2;

            $name = $block->getLine('@method');

            $equals = strpos($name, '#');

            if ($equals > 0)
            {
                $name = substr($name, $equals + 1);
            }

            $this->name = $name;

            $params = $block->getLines('@param');

            for ($i = 0; $i < count($params); $i++)
            {
                $this->parameters[] = new Parameter($params[$i]);
            }

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

            $this->help = $block->cleanContent();

            if ($block->getTypeBoolean('@return'))
            {
                $this->returns = new ReturnType($block->getLine('@return'));
            }

        }

    }

    class Property
    {
        public $line; // number, line number in the source file this is found on?
        public $name; // visible, name, parent
        public $types = []; // an array containing all possible types it can be: string, number, etc
        public $default = false; // assigned value is the default value
        public $help = [];
        public $inlineHelp = '';

        public $isPublic = true;
        public $isProtected = false;
        public $isPrivate = false;

        public $isReadOnly = false;

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

            $this->help = $block->cleanContent();

            if ($block->getTypeBoolean('@readonly'))
            {
                $this->isReadOnly = true;
            }

        }

    }

    class ScanFile
    {
        public $filename = '';
        public $js = '';

        public $blocks;

        public $consts = [];
        public $properties = [];
        public $methods = [];

        public function __construct($file)
        {
            $this->filename = $file;
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

                    $this->blocks[] = new Block($openLine, $closeLine, $js[$i + 1], $chunk);
                }
                else
                {
                    $chunk[] = $line;
                }
            }
        }

        public function total()
        {
            return count($this->blocks);
        }

    }


    // $blocks = [];

    // $consts = [];
    // $properties = [];
    // $methods = [];

    // $file = "../src/gameobjects/Sprite.js";
    $file = "../src/loader/Cache.js";

/*
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
*/

    //  That's the whole file scanned, how many blocks did we get out of it?

    echo count($blocks) . " blocks found\n\n";

    echo "\nConstants:\n\n";

    for ($i = 0; $i < count($blocks); $i++)
    {
        if ($blocks[$i]->isConst)
        {
            $const = new Constant($blocks[$i]);

            echo "\n\n";
            echo $const->name;
            echo "\n";
            print_r($const->types);
            // print_r($method->help);
        }
    }

    echo "\nMethods:\n\n";

    for ($i = 0; $i < count($blocks); $i++)
    {
        if ($blocks[$i]->isMethod)
        {
            $method = new Method($blocks[$i]);

            echo "\n\n";
            echo $method->name;
            echo "\n";
            print_r($method->help);
            print_r($method->parameters);
            print_r($method->returns);
        }
    }


    echo "\nProperties:\n\n";

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
            echo "Help: " . "\n";
            print_r($property->help);

            echo "\n\n";

            // echo $blocks[$i]->start . "\n";
        }
    }
?>
    </pre>

</body>
</html>