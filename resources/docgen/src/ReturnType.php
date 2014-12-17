<?php
    class ReturnType
    {
        // public $processor;
        public $types = []; // an array containing all possible types it can be: string, number, etc
        public $help = [];

        public function __construct($processor, $line)
        {
            // $this->processor = $processor;

            if (preg_match("/.*@return\s?{(\S*)} ?(.*)/", $line, $output))
            {
                //  Don't know if this is a Pixi or a Phaser return type
                // $this->types = $this->processor->parseTypes($output[1], null, '');
                $this->types = $processor->parseTypes($output[1], null, '');

                $this->help = $output[2];
            }
        }

        public function getArray()
        {
            return array(
                'type' => $this->types
            );
            
        }
        
        public function getJSON()
        {
            return json_encode($this->getArray());
        }

    }
?>