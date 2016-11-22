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

        public $dataTypes;
        public $domTypes;

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

            $this->domTypes = [ 
                'ArrayBuffer', 
                'AudioContext', 
                'CanvasRenderingContext2D', 
                'DOMElement',
                'Event',
                'Float32Array',
                'HTMLCanvasElement',
                'HTMLElement',
                'Image',
                'ImageData',
                'KeyboardEvent',
                'MouseEvent',
                'Pointer',
                'PointerEvent',
                'TouchEvent',
                'Uint16Array',
                'Uint32Array',
                'Uint8ClampedArray',
                'XDomainRequest',
                'XMLHttpRequest'
            ];

            $this->dataTypes = [ 
                'any', 
                'array', 
                'boolean', 
                'function', 
                'null', 
                'number', 
                'object', 
                'string',
                'undefined'
            ];

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

        public function parseTypes($output, $pixi, $name)
        {
            //  Remove optional braces
            if (substr($output, 0, 1) === "(")
            {
                $output = substr($output, 1, -1);
            }

            $types = explode('|', $output);

            if (!is_array($types))
            {
                $types = array($output);
            }

            //  @param {number[]|string[]} frames - An array of numbers or strings indicating which frames to play in which order.
            //  @param {(number[]|...number)} points - An array of 2d vectors that form the convex or concave polygon.
            //      Either [[0,0], [0,1],...] or a flat array of numbers that will be interpreted as [x,y, x,y, ...],
            //      or the arguments passed can be flat x,y values e.g. `setPolygon(options, x,y, x,y, x,y, ...)` where `x` and `y` are numbers.

            foreach ($types as $key => $type)
            {
                trim($type);

                if (substr($type, -2) === "[]")
                {
                    $tidy = substr($type, 0, -2);
                    $types[$key] = "array " . substr($type, 0, -2);
                }
                else if (strpos($type, '<') > 0)
                {
                    //  array<Phaser.Physics.P2.Material>

                    $left = strpos($type, '<') + 1;
                    // $right = strpos($type, '>') - 1;
                    $tidy = substr($type, $left, -1);

                    if ($tidy === 'Number' || $tidy === 'String')
                    {
                        $tidy = strtolower($tidy);
                    }
                    else if ($tidy === 'Point')
                    {
                        $tidy = 'Phaser.Point';
                    }
                    else if ($tidy === 'Texture' || $tidy === 'DisplayObject')
                    {
                        $tidy = 'PIXI.' . $tidy;
                    }

                    $types[$key] = 'array ' . $tidy;
                }
                else if (substr($type, 0, 5) === "Array")
                {
                    $types[$key] = "array";
                }
                else if ($type === "Number" || $type === "{Number}" || substr($type, 0, 7) === "Number " || $type === "Number..." || $type === "...number")
                {
                    $types[$key] = "number";
                }
                else if ($type === "String")
                {
                    $types[$key] = "string";
                }
                else if ($type === "Boolean")
                {
                    $types[$key] = "boolean";
                }
                else if ($type === "Function")
                {
                    $types[$key] = "function";
                }
                else if ($type === "Object")
                {
                    $types[$key] = "object";
                }
                else if ($type === "Null")
                {
                    $types[$key] = "null";
                }
                else if ($type === "Circle")
                {
                    $types[$key] = "Phaser.Circle";
                }
                else if ($type === "Point" || $type === "Point...")
                {
                    $types[$key] = "Phaser.Point";
                }
                else if ($type === "Line")
                {
                    $types[$key] = "Phaser.Line";
                }
                else if ($type === "Texture")
                {
                    $types[$key] = "PIXI.Texture";
                }
                else if ($type === "Polygon")
                {
                    $types[$key] = "Phaser.Polygon";
                }
                else if ($type === "Ellipse")
                {
                    $types[$key] = "Phaser.Ellipse";
                }
                else if ($type === "Rectangle")
                {
                    $types[$key] = "Phaser.Rectangle";
                }
                else if ($type === "Matrix")
                {
                    $types[$key] = "PIXI.Matrix";
                }
                else if ($type === "DisplayObject")
                {
                    $types[$key] = "PIXI.DisplayObject";
                }
                else if ($type === "Any" || $type === "{Any}" || $type === "*" || $type === "...*")
                {
                    $types[$key] = "any";
                }
                else
                {
                    //  Valid DOM types?
                    if (!in_array($type, $this->domTypes) && !in_array($type, $this->dataTypes))
                    {
                        if ($pixi === null)
                        {
                            //  It's a ReturnType but we don't know which sort
                            if (substr($type, 0, 7) !== 'Phaser.' && substr($type, 0, 5) !== 'PIXI.' && substr($type, 0, 3) !== 'p2.')
                            {
                                //  Going to assume PIXI here as Phaser has the return types properly namespaced
                                $types[$key] = "PIXI.$type";
                            }
                        }
                        else
                        {
                            //  Not a DOM type, shall we add PIXI to the front?
                            if ($pixi)
                            {
                                if (substr($type, 0, 5) !== 'PIXI.')
                                {
                                    $types[$key] = "PIXI.$type";
                                }
                            }
                            else
                            {
                                if (substr($type, 0, 7) !== 'Phaser.' && substr($type, 0, 5) !== 'PIXI.' && substr($type, 0, 3) !== 'p2.')
                                {
                                    $types[$key] = "wtf.$type";
                                    echo($name . '=');
                                    var_dump($type);
                                }
                            }
                        }
                    }
                }

                if (isset($this->docgen->uniqueTypes[$types[$key]]))
                {
                    $this->docgen->uniqueTypes[$types[$key]] += 1;
                }
                else
                {
                    $this->docgen->uniqueTypes[$types[$key]] = 1;
                    // echo($name . '=' . $type . "\n");
                    // var_dump($name);
                }
            }

            return $types;

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

        public function export($path)
        {
            file_put_contents($path . $this->class->name . '.json', $this->getJSON());
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