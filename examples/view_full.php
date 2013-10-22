<?php
    require('funcs.php');

    getFile();
?>
<!doctype html>
<html>
    <head>
        <meta charset="UTF-8" />
        <title>phaser - <?php echo $title?></title>
        <script src='http://code.jquery.com/jquery-latest.min.js' type='text/javascript'></script>
        <script src="https://google-code-prettify.googlecode.com/svn/loader/run_prettify.js"></script>
        <script src='assets/html/application.js' type='text/javascript'></script>
        <link href='stylesheet.css' media='screen' rel='stylesheet' type='text/css'>
        <?php
            require('phaser-debug-js.php');
        ?>
        <script src="<?php echo $filename?>"></script>
    </head>
    <body>

        <div class="header">
            <div class="box100 no-padding">
                <div class="phaser-version">
                    <span>Phaser Version: 1.1</span>
                    <!--<a href="#" class="version-button">Update to 1.2</a>-->
                </div>
            </div>
            <div class="clear"></div>
            <div class="line">
                <div class="box20">
                    <ul class="nav-links">
                        <li class="link-home"><a href="index.php">Back to examples</a></li>
                    </ul>
                </div>
                <div class="box60 txt-center">
                    <span class="main-title"><?php echo ucwords($title)?></span>
                </div>
                <div class="box20">
                    <div class="phaser-logo"></div>
                </div>
            </div>
            <div class="game-panel centered">
                <div id="phaser-example"></div>
                <div class="game-controls">
                    <ul class="left-controls">
                        <li class="controls-label"></li>
                        <li class="up-label"></li>
                        <li class="down-label"></li>
                        <li class="left-label"></li>
                        <li class="right-label"></li>
                        <li class="space-label"></li>
                    </ul>
                    <ul class="right-controls">
                        <li class="pause-button"></li>
                        <li class="mute-button"></li>
                        <li class="reset-button"></li>
                    </ul>
                </div>
            </div>
        </div>

        <div class="clear filler"></div>
        <p class="centered px800">Source code:</p>
        <pre class="code-block prettyprint centered">
        <?php
            echo $code;
        ?>
        </pre>
        </div>

        <div class="clear"></div>
        <div id="footer" class="footer">

            <div class="main-container centered">
                <div class="prize-bg">
                  <a href="#" class="prize-button">View details &amp; submit</a>
                </div>
                <div class="line">
                    <div class="box20">
                        <a href="http://www.photonstorm.com" class="photonstorm-logo"></a>
                        &copy; 2013 Photon Storm Ltd.<br/>
                        All rights reserved.
                    </div>
                    <div class="box5">
                        <div class="flixel-logo"></div>
                    </div>
                    <div class="box15">
                        Looking for a flash game framework?<br/>
                        <a href="http://flixel.org">Try Flixel</a>
                    </div>
                    <div class="box55 float-right">
                        <ul class="footer-links">
                            <li><a class="github-icon" href="https://github.com/photonstorm/phaser">Phaser on Github</a></li>
                            <li><a class="twitter-icon" href="https://twitter.com/photonstorm">@photonstorm</a></li>
                            <li><a class="forums-icon" href="http://www.html5gamedevs.com/forum/14-phaser/">Phaser Forums</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </body>
</html>