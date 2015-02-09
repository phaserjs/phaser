<?php
    class Property
    {
        public $processor;
        public $line;               // number, line number in the source file this is found on
        public $name;               // visible, name, parent
        public $types = [];         // an array containing all possible types it can be: string, number, etc
        public $default = null;     // assigned value is the default value
        public $help = [];
        public $inlineHelp = '';
        public $inherited = false;
        public $inheritedFrom = '';

        public $isPublic = true;
        public $isProtected = false;
        public $isPrivate = false;
        public $isReadOnly = false;

        public $corrupted = false;

        public function __construct($processor, $block)
        {
            $this->processor = $processor;

            //  Because zero offset + allowing for final line
            $this->line = $block->end + 2;

            preg_match("/(@.*){(\S*)} (\S*)( - ?)?(.*)/", $block->getLine('@property'), $output);

            if (count($output) > 3)
            {
                $result = $this->parsePhaser($output, $block);
            }
            else
            {
                preg_match("/(@.*) (.*)/", $block->getLine('@property'), $output);
                $result = $this->parsePixi($output, $block);
            }

            if ($result === false)
            {
                //  Bail out, tell the Process we've a duff Property here
                $this->corrupted = true;
                return false;
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

            if ($block->getTypeBoolean('@readonly') || $block->getTypeBoolean('@readOnly'))
            {
                $this->isReadOnly = true;
            }

            $this->help = $block->cleanContent();

            return true;

        }

        public function parsePhaser($output, $block)
        {
            $this->name = $output[3];
            $this->inlineHelp = $output[5];

            $this->types = $this->processor->parseTypes($output[2], false, $this->name);

            //  Default?
            if ($block->getTypeBoolean('@default'))
            {
                preg_match("/= (.*);/", $block->code, $defaultType);

                if ($defaultType && isset($defaultType[1]))
                {
                    $this->default = $defaultType[1];
                }
            }

            return true;

        }

        public function parsePixi($output, $block)
        {
            if (isset($output[2]))
            {
                $this->name = $output[2];
            }
            else
            {
                return false;
            }

            if ($block->getTypeBoolean('@type'))
            {
                $this->types = $this->processor->parseTypes($block->getTag('@type'), true, $this->name);
            }

            if ($block->getTypeBoolean('@default'))
            {
                $this->default = $block->getTag('@default');
            }

            return true;

        }

        public function getArray()
        {
            return array(
                'name' => $this->name,
                'type' => $this->types,
                'help' => implode('\n', $this->help),
                'inlineHelp' => $this->inlineHelp,
                'line' => $this->line,
                'default' => $this->default,
                'public' => $this->isPublic,
                'protected' => $this->isProtected,
                'private' => $this->isPrivate,
                'readOnly' => $this->isReadOnly
            );
            
        }
        
        public function getJSON()
        {
            return json_encode($this->getArray());
        }

    }
?>