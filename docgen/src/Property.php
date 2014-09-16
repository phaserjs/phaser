<?php
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

            if (count($output) > 3)
            {
                $this->parsePhaser($output, $block);
            }
            else
            {
                preg_match("/(@.*) (.*)/", $block->getLine('@property'), $output);
                $this->parsePixi($output, $block);
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

            if ($block->getTypeBoolean('@readonly'))
            {
                $this->isReadOnly = true;
            }

            $this->help = $block->cleanContent();

        }

        public function parsePhaser($output, $block)
        {
            $this->types = explode('|', $output[2]);
            $this->name = $output[3];
            $this->inlineHelp = $output[5];

            //  Default?
            if ($block->getTypeBoolean('@default'))
            {
                preg_match("/= (.*);/", $block->code, $defaultType);

                if ($defaultType && isset($defaultType[1]))
                {
                    $this->default = $defaultType[1];
                }
            }

        }

        public function parsePixi($output, $block)
        {
            $this->name = $output[2];

            if ($block->getTypeBoolean('@type'))
            {
                $this->types[] = $block->getTag('@type');
            }

            if ($block->getTypeBoolean('@default'))
            {
                $this->default = $block->getTag('@default');
            }

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