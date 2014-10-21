<?php
    class Parameter
    {
        public $processor;
        public $name; // rect, copy, etc
        public $types = []; // an array containing all possible types it can be: string, number, etc
        public $help = [];
        public $optional = false;
        public $default = null; // assigned value is the default value
        public $debug = '';

        public function __construct($processor, $line)
        {
            $this->processor = $processor;

            preg_match("/.*(@param)\s?{(\S*)} (\S*)( - ?)?(.*)/", $line, $output);

            // $this->processor->log("Parameter count: " . count($output));

            if (count($output) > 2)
            {
                // $this->processor->log("parsePhaser parameter");
                $this->parsePhaser($output);
            }
            else
            {
                preg_match("/(@param)\s(\S*)\s{(\S*)}\s?(.*)?/", $line, $output);

                // $this->processor->log("parsePixi parameter - " . count($output));
    
                if (count($output) > 0)
                {
                    $this->parsePixi($output);
                }
            }

        }

        public function parsePhaser($output)
        {
            $name = $output[3];
            
            // $this->processor->log("parameter: $name");

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

            $this->types = $this->processor->parseTypes($output[2], false, $name);

            $this->help[] = $output[5];

        }

        public function parsePixi($output)
        {
            $this->name = $output[2];

            // $this->processor->log("parameter: $this->name");

            $this->types = $this->processor->parseTypes($output[3], true, $this->name);

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