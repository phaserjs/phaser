<?php
    class ClassDesc
    {
        public $name; // Phaser.Sprite
        public $parameters = []; // an array containing the parameters
        public $help = [];
        public $extends = '';

        public $hasConstructor = false;
        public $isStatic = false;

        public function __construct($block)
        {
            $this->name = $block->getLineContent('@class');

            $params = $block->getLines('@param');

            for ($i = 0; $i < count($params); $i++)
            {
                $this->parameters[] = new Parameter($params[$i]);
            }

            if ($block->getTypeBoolean('@extends'))
            {
                $this->extends = $block->getLineContent('@extends');
            }

            if ($block->getTypeBoolean('@constructor'))
            {
                $this->hasConstructor = true;
            }
            else
            {
                //  Like Phaser.Math
                $this->isStatic = true;
            }

            //  This is a problem because the @classdesc block is often multi-line, but repeated in the clear content too.
            //  So all the classes probably need tidying up before this part will work correctly.

            $this->help = $block->cleanContent();

        }

        public function getArray()
        {
            return array(
                'name' => $this->name,
                'extends' => $this->extends,
                'static' => $this->isStatic,
                'constructor' => $this->hasConstructor,
                'parameters' => $this->parameters,
                'help' => implode('\n', $this->help)
            );
            
        }
        
        public function getJSON()
        {
            return json_encode($this->getArray());
        }

    }
?>