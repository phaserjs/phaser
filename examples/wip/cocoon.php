<!doctype html>
<html>
    <head>
        <meta charset="UTF-8" />
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
    </head>
    <body>

        <div id="phaser-example"></div>

    </body>
</html>