<?php
    class Block
    {
        public $start = 0;
        public $end = 0;
        public $code = '';
        public $content;

        public $isProperty = false;
        public $isMethod = false;
        public $isConst = false;
        public $isClass = false;

        public function __construct($start, $end, $code, $content)
        {
            $this->start = $start;
            $this->end = $end;
            $this->code = $code;
            $this->content = $content;

            // preg_match("/(@.*){(\S*)}(.*) -(.*)/", $input_line, $output_array);
            // this one captures a property even with a * at the start

            $this->isProperty = $this->getTypeBoolean('@property');
            $this->isMethod = $this->getTypeBoolean('@method');
            $this->isConst = $this->getTypeBoolean('@constant');
            $this->isClass = $this->getTypeBoolean('@class');
        }

        public function getTypeBoolean($scan)
        {
            for ($i = 0; $i < count($this->content); $i++)
            {
                preg_match("/(@\w*)/", $this->content[$i], $output);

                if ($output && $output[0] === $scan)
                {
                    return true;
                }
            }

            return false;
        }

        public function getLineContent($scan)
        {
            $line = $this->getLine($scan);

            if ($line !== false)
            {
                $pattern = '/.*' . $scan . ' (.*)/';

                preg_match($pattern, $line, $output);

                if ($output)
                {
                    return trim($output[1]);
                }
            }

            return false;

        }

        public function getLine($scan)
        {
            $i = $this->getContentIndex($scan);

            if ($i > -1)
            {
                return $this->content[$i];
            }
            else
            {
                return false;
            }
        }

        public function getContentIndex($scan, $offset = 0)
        {
            for ($i = $offset; $i < count($this->content); $i++)
            {
                preg_match("/(@\w*)/", $this->content[$i], $output);

                if ($output && $output[0] === $scan)
                {
                    return $i;
                }
            }

            return -1;
        }

        public function getLines($scan)
        {
            $output = [];

            for ($i = 0; $i < count($this->content); $i++)
            {
                preg_match("/(@\w*)/", $this->content[$i], $line);

                if ($line && $line[0] === $scan)
                {
                    $output[] = $this->content[$i];
                }
            }

            return $output;
        }

        public function cleanContent()
        {
            $output = [];

            for ($i = 0; $i < count($this->content); $i++)
            {
                $line = trim($this->content[$i]);

                //  remove * from the start
                if (substr($line, 0, 1) === '*')
                {
                    $line = substr($line, 1);
                    $line = trim($line);
                }

                //  Have we got a @ next?
                if (substr($line, 0, 1) !== '@')
                {
                    $output[] = $line;
                }
            }

            //  Trim off the final element if empty
            if (count($output) > 0 && $output[count($output) - 1] === '')
            {
                array_pop($output);
            }

            return $output;
        }

    }
?>