<?php
    class Parameter
    {
        public $name; // rect, copy, etc
        public $types = []; // an array containing all possible types it can be: string, number, etc
        public $help = [];
        public $optional = false;
        public $default = null; // assigned value is the default value
        public $debug = '';

        public function __construct($line)
        {
            preg_match("/.*(@param)\s?{(\S*)} (\S*)( - ?)?(.*)/", $line, $output);

            if (count($output) > 2)
            {
                $this->parsePhaser($output);
            }
            else
            {
                preg_match("/(@param)\s(\S*)\s{(\S*)}\s?(.*)?/", $line, $output);
                $this->parsePixi($output);
            }

        }

        public function parsePhaser($output)
        {
            $name = $output[3];

            if ($name[0] === '[')
            {
                $this->optional = true;
                $name = substr($name, 1, -1);

                //  Default?
                $equals = strpos($name, '=');

                if ($equals > 0)
                {
                    $this->default = (string) substr($name, $equals + 1);
                    $name = substr($name, 0, $equals);
                }
            }

            $this->name = $name;

            //  Remove optional braces
            if (substr($output[2], 0, 1) === "(")
            {
                $output[2] = substr($output[2], 1, -1);
            }

            $this->types = explode('|', $output[2]);

            //  @param {number[]|string[]} frames - An array of numbers or strings indicating which frames to play in which order.
            //  @param {(number[]|...number)} points - An array of 2d vectors that form the convex or concave polygon.
            //      Either [[0,0], [0,1],...] or a flat array of numbers that will be interpreted as [x,y, x,y, ...],
            //      or the arguments passed can be flat x,y values e.g. `setPolygon(options, x,y, x,y, x,y, ...)` where `x` and `y` are numbers.

            foreach ($this->types as $key => $type)
            {
                if (substr($type, -2) === "[]")
                {
                    $this->types[$key] = "Array " . substr($type, 0, -2);
                }
            }

            $this->help[] = $output[5];

        }

        public function parsePixi($output)
        {
            $this->name = $output[2];
            $this->types[] = $output[3];

            if (isset($output[4]))
            {
                $this->help[] = $output[4];
            }
        }

        public function getArray()
        {
            return array(
                'name' => $this->name,
                'type' => $this->types,
                'help' => implode('\n', $this->help),
                'optional' => $this->optional,
                'default' => $this->default
            );
            
        }
        
        public function getJSON()
        {
            return json_encode($this->getArray());
        }

    }
?>