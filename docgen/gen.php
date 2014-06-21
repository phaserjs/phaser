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

    class ReturnType
    {
        public $types = []; // an array containing all possible types it can be: string, number, etc
        public $help = [];

        public function __construct($line)
        {
// echo "rt: $line \n";
            if (preg_match("/.*@return\s?{(\S*)} ?(.*)/", $line, $output))
            {
                $this->types = explode('|', $output[1]);
                $this->help = $output[2];
// echo "rt2: " . $this->help . "\n";
// echo "rt3: ";
// print_r($this->types);
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


    $blocks = [];

    $consts = [];
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