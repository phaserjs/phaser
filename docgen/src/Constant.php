<?php
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
        
        public function getArray()
        {
            $a = array(
                'name' => $this->name,
                'type' => $this->types[0],
                'help' => implode('\n', $this->help),
                'line' => $this->line
            );
            
            return $a;
            
        }
        
        public function getJSON()
        {
            return json_encode($this->getArray());
        }

    }
?>