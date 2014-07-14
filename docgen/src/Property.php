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
?>