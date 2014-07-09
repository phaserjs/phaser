<?php
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
?>