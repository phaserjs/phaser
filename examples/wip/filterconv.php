<?php
    $output = "this.fragmentSrc = [\n";

    if (isset($_POST['shader']))
    {
        $shader = explode("\n", $_POST['shader']);

        for ($i = 0; $i < count($shader); $i++)
        {
            $output = $output . "\t\"" . trim($shader[$i]) . "\",\n";
        }
    }

    $output .= "];";
?>
<!doctype html>
<html>
    <head>
        <meta charset="UTF-8" />
        <title>phaser - filter conv</title>
        <style>
            body {
                font-family: Arial;
                font-size: 14px;
            }
        </style>
    </head>
    <body>

        <form action="filterconv.php" method="post">

        <h2>Input</h2>
        <textarea name="shader" style="width: 800px; height: 400px"></textarea>

        <h2>Output</h2>
        <textarea style="width: 800px; height: 400px"><?php echo $output ?></textarea>

        <br />

        <input type="submit" value="Convert" />

        </form>

    </body>
</html>