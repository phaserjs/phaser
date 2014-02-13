<?php
    if (isset($_GET['f']))
    {
        $f = $_GET['f'];
    }
?>
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"> 
        <meta name="viewport" content="width=device-width, initial-scale=1.0"> 
        <title>phaser labs - <?php echo $f?></title>
        <meta name="description" content="The playground for the phaser game framework" />
        <meta name="keywords" content="phaser, html5, games, playground, labs, experiments" />
        <meta name="author" content="Photon Storm" />
        <link rel="shortcut icon" href="gfx/favicon.ico">
        <link rel="stylesheet" type="text/css" href="css/normalize.css" />
        <link rel="stylesheet" type="text/css" href="css/demo.css" />
        <link rel="stylesheet" type="text/css" href="css/component.css" />
        <script src="js/modernizr.custom.js"></script>
        <base href="../examples/"></base>
        <?php
            require('../build/config.php');
        ?>
        <script src="../labs/code/<?php echo $f?>" type="text/javascript"></script>
    </head>
    <body>

        <div id="phaser-example"></div>

        <div id="labs"><a href="../labs/index.php"><img src="_site/labs/logo.png" /></a></div>

        <div class="container">

            <section class="color-4">
                <nav class="cl-effect-2">
                <?php
                    echo printJSLinks($files);
                ?>
                </nav>
                <div id="photonstorm">labs is the playground and test site for <a href="http://phaser.io">phaser.io</a> &copy; 2014 <a href="https://twitter.com/photonstorm">@photonstorm</a></div>
            </section>

        </div>

</body>
</html>