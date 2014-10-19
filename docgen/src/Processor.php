<?php
    class Processor
    {
        public $file;
        public $blocks;

        public $class;
        public $consts;
        public $methods;
        public $properties;

        public $docgen;
        public $processLog;

        public $corrupted;

        /**
        * Processes the given JS source file.
        * 
        * @param mixed $file
        * @return Processor
        */
        public function __construct($docgen, $file)
        {
            $this->docgen = $docgen;

            $this->class = null;
            $this->consts = [];
            $this->methods = [];
            $this->properties = [];
            $this->file = $file;

            $this->corrupted = false;

            $this->methods['private'] = [];
            $this->methods['protected'] = [];
            $this->methods['public'] = [];
            $this->methods['static'] = [];

            $this->properties['private'] = [];
            $this->properties['protected'] = [];
            $this->properties['public'] = [];

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

                    if (isset($js[$i + 1]))
                    {
                        $this->blocks[] = new Block($openLine, $closeLine, $js[$i + 1], $chunk);
                    }
                }
                else
                {
                    $chunk[] = $line;
                }
            }

            //  Process the data into our documentation types
            for ($i = 0; $i < $this->total(); $i++)
            {
                if ($this->blocks[$i]->isClass)
                {
                    //  Some files like PIXI.Graphics have multiple class blocks within them
                    if ($this->class === null)
                    {
                        $tempClass = new ClassDesc($this, $this->blocks[$i]);
                        $this->class = $tempClass;

                        if ($tempClass->corrupted)
                        {
                            $this->corrupted = true;
                        }
                    }
                }
                else if ($this->blocks[$i]->isConst)
                {
                    $tempConst = new Constant($this, $this->blocks[$i]);

                    $this->consts[$tempConst->name] = $tempConst;
                }
                else if ($this->blocks[$i]->isMethod)
                {
                    $tempMethod = new Method($this, $this->blocks[$i]);

                    if ($tempMethod->isPublic)
                    {
                        $this->methods['public'][$tempMethod->name] = $tempMethod;
                    }
                    else if ($tempMethod->isProtected)
                    {
                        $this->methods['protected'][$tempMethod->name] = $tempMethod;
                    }
                    else if ($tempMethod->isPrivate)
                    {
                        $this->methods['private'][$tempMethod->name] = $tempMethod;
                    }
                    else if ($tempMethod->isStatic)
                    {
                        $this->methods['static'][$tempMethod->name] = $tempMethod;
                    }
                }
                else if ($this->blocks[$i]->isProperty)
                {
                    $tempProperty = new Property($this, $this->blocks[$i]);

                    if ($tempProperty->corrupted === false)
                    {
                        if ($tempProperty->isPublic)
                        {
                            $this->properties['public'][$tempProperty->name] = $tempProperty;
                        }
                        else if ($tempProperty->isProtected)
                        {
                            $this->properties['protected'][$tempProperty->name] = $tempProperty;
                        }
                        else if ($tempProperty->isPrivate)
                        {
                            $this->properties['private'][$tempProperty->name] = $tempProperty;
                        }
                    }
                }
            }

            if ($this->class === null)
            {
                $this->corrupted = true;
            }

            $this->sortArrays();

        }

        public function getPublicProperties()
        {
            return $this->properties['public'];
        }

        public function getPublicMethods()
        {
            return $this->methods['public'];
        }
       
        public function getArray()
        {
            $consts = [];
            $methods = [];
            $properties = [];

            foreach ($this->consts as $key => $value)
            {
                $consts[] = $value->getArray();
            }

            //  Methods

            $methods['public'] = [];
            $methods['protected'] = [];
            $methods['private'] = [];
            $methods['static'] = [];

            foreach ($this->methods['public'] as $key => $value)
            {
                $methods['public'][] = $value->getArray();
            }

            foreach ($this->methods['protected'] as $key => $value)
            {
                $methods['protected'][] = $value->getArray();
            }

            foreach ($this->methods['private'] as $key => $value)
            {
                $methods['private'][] = $value->getArray();
            }

            foreach ($this->methods['static'] as $key => $value)
            {
                $methods['static'][] = $value->getArray();
            }

            //  Properties

            $properties['public'] = [];
            $properties['protected'] = [];
            $properties['private'] = [];

            foreach ($this->properties['public'] as $key => $value)
            {
                $properties['public'][] = $value->getArray();
            }

            foreach ($this->properties['protected'] as $key => $value)
            {
                $properties['protected'][] = $value->getArray();
            }

            foreach ($this->properties['private'] as $key => $value)
            {
                $properties['private'][] = $value->getArray();
            }

            return array(
                'class' => $this->class->getArray(),
                'consts' => $consts,
                'methods' => $methods,
                'properties' => $properties
            );
            
        }
        
        public function getJSON()
        {
            return json_encode($this->getArray());
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

        public function extend()
        {
            //  Quick bailout
            if (!$this->class->extendsFrom())
            {
                return;
            }

            $proc = $this;

            do
            {
                $extends = $proc->class->extends;
                $proc = $this->docgen->get($extends);

                if ($proc !== null)
                {
                    // echo "\n\nextend found: " . $proc->getName() . "\n";
                    $this->merge($proc);
                }
                else
                {
                    // echo "\n\n --------> fatal extend: " . $extends . "\n";
                }
            }
            while ($proc->class->extendsFrom());

            $this->sortArrays();

        }

        public function sortArrays()
        {
            //  Alphabetically sort the arrays based on the key
            ksort($this->consts);

            ksort($this->methods['public']);
            ksort($this->methods['protected']);
            ksort($this->methods['private']);
            ksort($this->methods['static']);

            ksort($this->properties['public']);
            ksort($this->properties['protected']);
            ksort($this->properties['private']);
        }

        public function getMethodNames()
        {
            $output = [];

            foreach ($this->methods['public'] as $key => $method)
            {
                $output[$method->name] = true;
            }

            return $output;
        }

        public function getPropertyNames()
        {
            $output = [];

            foreach ($this->properties['public'] as $key => $property)
            {
                $output[$property->name] = true;
            }

            return $output;
        }

        public function merge($processor)
        {
            //  We only want to merge in public methods and properties.
            //  Technically JavaScript merges in bloody everything, but for the sake of docs we'll keep them #public# only.

            $inheritedMethods = $processor->getPublicMethods();
            $currentMethods = $this->getMethodNames();

            //  Flag them as inherited
            foreach ($inheritedMethods as $key => $method)
            {
                if (!array_key_exists($method->name, $currentMethods))
                {
                    $method->inherited = true;
                    $method->inheritedFrom = $processor->getName();
                    $this->methods['public'][$method->name] = $method;
                }
            }

            $inheritedProperties = $processor->getPublicProperties();
            $currentProperties = $this->getPropertyNames();

            //  Flag them as inherited!
            foreach ($inheritedProperties as $key => $property)
            {
                if (!array_key_exists($property->name, $currentProperties))
                {
                    $property->inherited = true;
                    $property->inheritedFrom = $processor->getName();
                    $this->properties['public'][$property->name] = $property;
                }
            }
        }

        /**
        * The total number of blocks scanned.
        */
        public function total()
        {
            return count($this->blocks);
        }

        public function log($text) {

            $this->processLog[] = $text;

        }

        public function getLog() {

            return $this->processLog;
            // return array_reverse($this->processLog);

        }

        public function getName() {

            return $this->class->name;

        }

        public function __toString()
        {
            if ($this->corrupted)
            {
                return "JSDoc Corrupted Class";
            }
            else
            {
                return "Class: " . $this->class->name . ", Methods: " . count($this->methods['public']) . ", Properties: " . count($this->properties['public']);
            }
        }

    }
?>