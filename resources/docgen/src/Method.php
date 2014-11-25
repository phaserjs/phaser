<?php
    class Method
    {
        public $processor;
        public $line; // number, line number in the source file this is found on?
        public $name; // bringToTop, kill, etc
        public $title = [];
        public $parameters = []; // an array containing the parameters
        public $help = [];
        public $returns = null;
        public $inherited = false;
        public $inheritedFrom = '';

        public $isPublic = true;
        public $isProtected = false;
        public $isPrivate = false;

        public $isStatic = false;

        public function __construct($processor, $block)
        {
            $this->processor = $processor;

            //  Because zero offset + allowing for final line
            $this->line = $block->end + 2;

            $name = $block->getLine('@method');

            $equals = strpos($name, '#');

            if ($equals > 0)
            {
                $name = substr($name, $equals + 1);
            }
            else
            {
                $equals = strrpos($name, '.');

                if ($equals > 0)
                {
                    $name = substr($name, $equals + 1);
                }
                else
                {
                    //  No # and no . so we'll assume "@method name" format
                    $equals = strrpos($name, ' ');

                    if ($equals > 0)
                    {
                        $name = substr($name, $equals + 1);
                    }
                }
            }

            // $this->processor->log("vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv");
            // $this->processor->log("Method: $name");
            // $this->processor->log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");

            $this->name = $name;

            $params = $block->getLines('@param');

            for ($i = 0; $i < count($params); $i++)
            {
                $this->parameters[] = new Parameter($this->processor, $params[$i]);
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

            if ($block->getTypeBoolean('@static'))
            {
                $this->isStatic = true;
            }

            $this->title = array("name" => $this->name, "visibility" => $this->getVisibility());

            $this->help = $block->cleanContent();

            if ($block->getTypeBoolean('@return'))
            {
                $this->returns = new ReturnType($this->processor, $block->getLine('@return'));
            }

        }

        public function getVisibility()
        {
            if ($this->isPublic)
            {
                return 'public';
            }
            else if ($this->isProtected)
            {
                return 'protected';
            }
            else if ($this->isPrivate)
            {
                return 'private';
            }
        }

        public function getArray()
        {
            $params = [];

            foreach ($this->parameters as $key => $value)
            {
                $params[] = $value->getArray();
            }

            return array(
                'name' => $this->title['name'],
                'static' => $this->isStatic,
                'returns' => $this->returns,
                'help' => implode('\n', $this->help),
                'line' => $this->line,
                'public' => $this->isPublic,
                'protected' => $this->isProtected,
                'private' => $this->isPrivate,
                'parameters' => $params,
                'inherited' => $this->inherited,
                'inheritedFrom' => $this->inheritedFrom
            );
            
        }
        
        public function getJSON()
        {
            return json_encode($this->getArray());
        }

    }
?>