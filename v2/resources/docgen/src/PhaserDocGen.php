<?php
    class PhaserDocGen
    {
        private $src;
        private $ignore = array('.', '..');
        private $fileIgnore = array('Intro.js', 'Outro.js', 'Pixi.js', 'Spine.js', 'p2.js');

        public $log;
        public $files;
        public $classes;

        public $uniqueTypes;

        /**
        * Processes the Phaser / Pixi source code
        * 
        * @return PhaserDocGen
        */
        public function __construct()
        {
            $this->src = realpath('../src');

            $this->uniqueTypes = [];

            $this->classes = [];
        }

        public function start()
        {
            $this->files = $this->dirToArray($this->src);
        }

        public function extend($classKey = '')
        {
            if ($classKey !== '')
            {
                // echo "Extending $classKey\n";
                $this->classes[$classKey]->extend();
            }
            else
            {
                //  This will go through each class and add in inherited properties, etc
                foreach ($this->classes as $key => $processor)
                {
                    if ($processor !== 'corrupted')
                    {
                        // echo "Extended $key\n";
                        $processor->extend();
                    }
                }
            }
        }

        public function export($path, $classKey = '')
        {
            if ($classKey !== '')
            {
                $this->classes[$classKey]->export($path);
            }
            else
            {
                //  This will go through each class and add in inherited properties, etc
                foreach ($this->classes as $key => $processor)
                {
                    if ($processor !== 'corrupted')
                    {
                        $processor->export($path);
                        echo "Exported $key\n";
                        // echo $processor . "\n";
                    }
                }
            }
        }

        public function get($classKey)
        {
            if (array_key_exists($classKey, $this->classes))
            {
                return $this->classes[$classKey];
            }

            return null;
        }

        private function dirToArray($dir)
        {
            set_time_limit(60);

            $result = [];
            $root = scandir($dir); 
            $dirs = array_diff($root, $this->ignore);

            foreach ($dirs as $key => $value) 
            { 
                $path = realpath($dir . DIRECTORY_SEPARATOR . $value);

                if (is_dir($path)) 
                {
                    $result[$value] = $this->dirToArray($path); 
                } 
                else 
                {
                    if (substr($value, -3) === '.js')
                    {
                        if (!in_array($value, $this->fileIgnore))
                        {
                            $index = str_replace($this->src, "", $path);
                            $index = substr($index, 1);
                            $tempProcessor = new Processor($this, "../src/$index");

                            if ($tempProcessor->corrupted === false)
                            {
                                if ($tempProcessor->class)
                                {
                                    $classKey = $tempProcessor->class->name;
                                }
                                else
                                {
                                    $classKey = 'wtf' . rand();
                                }

                                // $classKey = substr($value, 0, -3);
                                // $classKey = str_replace(DIRECTORY_SEPARATOR, ".", $index);
                                $result[$classKey] = $index;
                                // echo "Class key: $classKey \n";
                                $this->classes[$classKey] = $tempProcessor;
                            }
                            else
                            {
                                $this->classes[$index] = 'corrupted';
                                // echo "CORRUPTED \n";
                            }

                            //  Dump to log
                            // echo $index . "\n";
                        }
                        else
                        {
                            // echo "Ignored: $value \n";
                        }
                    }
                    else
                    {
                        // echo "NOT A JS FILE\n";
                    }
                } 
            } 

            return $result; 

        }

    }

?>