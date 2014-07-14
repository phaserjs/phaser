<?php
    class Processor
    {
        public $file;
        public $blocks;

        public $consts;
        public $methods;
        public $properties;

        /**
        * Processes the given JS source file.
        * 
        * @param mixed $file
        * @return Processor
        */
        public function __construct($file)
        {
            $this->consts = [];
            $this->methhods = [];
            $this->properties = [];
            $this->file = $file;

            $this->scanFile();
        }

        /**
        * Scans the given JS source file and extracts blocks from it
        */
        private function scanFile() {

            $js = file($this->file);

            $scanningForOpen = true;
            $scanningForClose = false;

            $openLine = 0;
            $closeLine = 0;
            $chunk = [];

            //  Literally scan the JS file, line by line
            for ($i = 0; $i < count($js); $i++)
            {
                $line = trim($js[$i]);

                if ($scanningForOpen && $line === "/**")
                {
                    $scanningForOpen = false;
                    $scanningForClose = true;
                    $chunk = [];
                    $openLine = $i;
                }

                if ($scanningForClose && $line === "*/")
                {
                    $scanningForOpen = true;
                    $scanningForClose = false;
                    $closeLine = $i;

                    //  The first element is always the opening /** so remove it
                    array_shift($chunk);

                    $this->blocks[] = new Block($openLine, $closeLine, $js[$i + 1], $chunk);
                }
                else
                {
                    $chunk[] = $line;
                }
            }

            //  Process the data into our documentation types
            for ($i = 0; $i < $this->total(); $i++)
            {
                if ($this->blocks[$i]->isConst)
                {
                    $this->consts[] = new Constant($this->blocks[$i]);
                }
                else if ($this->blocks[$i]->isMethod)
                {
                    $this->methods[] = new Method($this->blocks[$i]);
                }
                else if ($this->blocks[$i]->isProperty)
                {
                    $this->properties[] = new Property($this->blocks[$i]);
                }
            }

        }
        
        public function getConstsArray()
        {
            $out = [];

            for ($i = 0; $i < count($this->consts); $i++)
            {
                $out[] = $this->consts[$i]->getArray();
            }
            
            return $out;
        }

        /**
        * The total number of blocks scanned.
        */
        public function total()
        {
            return count($this->blocks);
        }

    }
?>