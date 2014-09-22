<?php
    class ClassDesc
    {
        public $processor;
        public $name; // Phaser.Sprite
        public $parameters = []; // an array containing the parameters
        public $help = [];
        public $extends = '';

        public $hasConstructor = false;
        public $isStatic = false;

        public $corrupted = false;

        public function __construct($processor, $block)
        {
            $this->processor = $processor;

            if ($block->getTypeBoolean('@class') === false)
            {
                $this->corrupted = true;
                return;
            }

            $this->name = $block->getLineContent('@class');

            if (substr($this->name, 0, 6) !== 'Phaser')
            {
                $this->name = 'PIXI.' . $this->name;
            }

            $this->processor->log("vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv");
            $this->processor->log("Class: $this->name");
            $this->processor->log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");

            $params = $block->getLines('@param');

            for ($i = 0; $i < count($params); $i++)
            {
                $this->parameters[] = new Parameter($this->processor, $params[$i]);
            }

            if ($block->getTypeBoolean('@extends'))
            {
                $this->extends = $block->getLineContent('@extends');

                if (substr($this->extends, 0, 6) !== 'Phaser' && substr($this->extends, 0, 4) !== 'PIXI')
                {
                    $this->extends = 'PIXI.' . $this->extends;
                }
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

        public function extendsFrom()
        {
            if ($this->extends !== '')
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        public function getArray()
        {
            $params = [];

            for ($i = 0; $i < count($this->parameters); $i++)
            {
                $params[] = $this->parameters[$i]->getArray();
            }

            return array(
                'name' => $this->name,
                'extends' => $this->extends,
                'static' => $this->isStatic,
                'constructor' => $this->hasConstructor,
                'parameters' => $params,
                'help' => implode('\n', $this->help)
            );
            
        }
        
        public function getJSON()
        {
            return json_encode($this->getArray());
        }

    }
?>