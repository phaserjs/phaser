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

        private function dirToArray($dir)
        {
            //  set timeout
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
                            $result[substr($value, 0, -3)] = $index;

                            $this->classes[substr($value, 0, -3)] = new Processor("../src/$index");

                            //  Dump to log
                            echo $index . "\n";

                            ob_flush();
                            // $this->log[] = $value;
                        }
                    }
                } 
            } 

            return $result; 

        }

    }

?>