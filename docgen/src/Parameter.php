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

    }
?>