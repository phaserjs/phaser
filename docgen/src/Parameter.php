<?php
    class Parameter
    {
        public $name; // rect, copy, etc
        public $types = []; // an array containing all possible types it can be: string, number, etc
        public $help = [];
        public $optional = false;
        public $default = false; // assigned value is the default value
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
            $this->types = explode('|', $output[2]);
            $this->help = $output[5];

            $name = $output[3];

            // $this->debug = $name . " -- ";

            if ($name[0] === '[')
            {
                $this->optional = true;
                $name = substr($name, 1, -1);

                // $this->debug .= $name . " -- ";

                //  Default?
                $equals = strpos($name, '=');

                if ($equals > 0)
                {
                    $this->default = (string) substr($name, $equals + 1);
                    $name = substr($name, 0, $equals);
                    // $this->debug .= $name . " -eq- " . $equals . " -def- " . $this->default;
                }
            }

            $this->name = $name;

        }

        public function parsePixi($output)
        {
            $this->name = $output[2];
            $this->types[] = $output[3];

            if (isset($output[4]))
            {
                $this->help = $output[4];

            }
        }

    }
?>