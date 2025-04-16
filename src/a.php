<?php

function scan($dir, $callback)
{
    $h = opendir($dir);
    while (false !== $file = readdir($h)) {
        if ('.' == $file || '..' == $file) continue;
        $filename = $dir . DIRECTORY_SEPARATOR . $file;
        if (is_dir($filename)) {
            scan($filename, $callback);
        } else {
            if (str_ends_with($file, '.js')) {
                $callback($filename, $dir);
            }
        }
    }
    closedir($h);
}

$classCount = 0;
$extendsCount = 0;
scan(__DIR__, function ($filename, $dir) use (&$classCount, &$extendsCount) {
    // echo $filename . "\n";
    $content = file_get_contents($filename);
    $newClassPattern = '/(^var (\w+) = )new Class\((\{.*?^})\)(;$)/ms';
    if (preg_match($newClassPattern, $content, $newClassMatch)) {
        $classCount++;

        $classContent = $newClassMatch[0];
        $className = $newClassMatch[2];

        $extend = '';
        $extendsPattern = '/\s*?^ {4}Extends: (\w+),/m';
        if (preg_match($extendsPattern, $classContent, $extendsMatch)) {
            // $extendsCount++;
            // echo $extendsMatch[1] . "\n";
            $classContent = preg_replace($extendsPattern, '', $classContent);
            $extend = ' extends ' . $extendsMatch[1];

            $classContent = preg_replace("/\b{$extendsMatch[1]}\.call\(\s*this\b,?\s*(.*?\);)/", 'super($1', $classContent);
        }

        $classContent = preg_replace('/\binitialize\s*:\s*function\s*\w+\s*/', 'constructor', $classContent);

        $classContent = preg_replace($newClassPattern, "$1class$extend $3$4", $classContent);

        $classContent = preg_replace('/(^ {4}\w+)\s*:\s*\bfunction\b\s*/m', '$1', $classContent);
        $classContent = preg_replace('/(^ {4}}),/m', '$1', $classContent);

        $classContent = preg_replace_callback('/^ {4}\bMixins: \[(.*?^ {4})],/ms', function ($matches) use ($className) {
            $mixins = str_replace('        ', '            ', $matches[1]);
            return <<<JS
                static
                {
                    Class.mixin(this, [$mixins    ], false);
                }
            JS;
        }, $classContent);

        $classContent = preg_replace_callback('/^ {4}(\w+)\s*:\s*\{(.*?(\bget\s*:|\bset\s*:).*?^ {4})}/ms', function ($matches) {
            $body = $matches[2];
            $body = preg_replace('/(^ {8}}),/m', '$1', $body);
            $body = trim($body);
            $body = "\n    $body";
            $body = preg_replace('/^ {8}/m', '    ', $body);

            return preg_replace('/(\b(g|s)et)\s*:\s*function\b\s*/', "$1 $matches[1]", $body);
        }, $classContent);

        $content = preg_replace($newClassPattern, $classContent, $content);
        // echo $content;
        file_put_contents($filename, $content);
    }
});

// echo $classCount; // 302
// echo $extendsCount; // 191
