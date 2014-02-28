<!doctype html>
<html>
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="initial-scale=1 maximum-scale=1 user-scalable=0 minimal-ui" />
        <title>phaser</title>
        <base href="../" />
        <?php
            require('../../build/config.php');

            if (isset($_GET['f']))
            {
                $f = $_GET['f'];
        ?>
        <script src="wip/<?php echo $f?>" type="text/javascript"></script>
        <?php
            }
        ?>
        <style>
            body {
                margin: 0;
                padding: 0;
            }
        </style>
    </head>
    <body>

        <div id="phaser-example"></div>

    </body>
</html>