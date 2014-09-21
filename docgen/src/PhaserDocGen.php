<?php
    class PhaserDocGen
    {
        private $src;
        private $ignore = array('.', '..');
        private $fileIgnore = array('p2.js');

        public $log;
        public $files;
        public $classes;

        /**
        * Processes the Phaser / Pixi source code
        * 
        * @return PhaserDocGen
        */
        public function __construct()
        {
            $this->src = realpath('../src');

            $this->classes = [];

        }

        public function start()
        {
            ob_start();

            $this->files = $this->dirToArray($this->src);

            ob_end_flush();
        }

        public function extend()
        {
            //  This will go through each class and add in inherited properties, etc
            foreach ($this->classes as $key => $processor)
            {
                $processor->extend();

                echo "Extended $key\n";
                ob_flush();
            }
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
                                $this->classes[$classKey] = $tempProcessor;
                            }
                            else
                            {
                                $this->classes[$index] = 'corrupted';
                            }

                            //  Dump to log
                            // echo $index . "\n";
                            ob_flush();
                        }
                    }
                } 
            } 

            return $result; 

        }

    }

?>