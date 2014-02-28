<!doctype html>
<html>
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="initial-scale=1 maximum-scale=1 user-scalable=0 minimal-ui" />
        <title>phaser</title>
        <base href="../" />
        <script src="_site/js/jquery-2.0.3.min.js" type="text/javascript"></script>
        <script src="../build/phaser.js" type="text/javascript"></script>
        <?php
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

        <p><a href="wip/index.php">Back to index</a></p>

    </body>
</html>