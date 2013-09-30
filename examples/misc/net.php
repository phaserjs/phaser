<?php
    $title = "Motion";
    require('../head.php');
?>

<script type="text/javascript">

(function () {

    var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { render:render});

    function render () {

        game.debug.renderText('Host Name:'+game.net.getHostName(),game.world.centerX-300,20);
        game.debug.renderText('Host Name contains 192:'+game.net.checkDomainName('192'),game.world.centerX-300,40);
        game.debug.renderText('Host Name contains google.com:'+game.net.checkDomainName('google.com'),game.world.centerX-300,60);

        //  Add some values to the query string
        game.debug.renderText('Query string with new values : '+game.net.updateQueryString('atari', '520'),game.world.centerX-400,80);
        game.debug.renderText('Query string with new values : '+game.net.updateQueryString('amiga', '1200'),game.world.centerX-400,100);
        game.debug.renderText('Query string with new values : '+game.net.updateQueryString('commodore', '64'),game.world.centerX-400,120);

        console.log('Query String: '+game.net.getQueryString(),game.world.centerX-300,140);
        console.log('Query String Param: '+game.net.getQueryString('atari'),game.world.centerX-300,160);
    }



})();


</script>

<a href="<?php echo $_SERVER['PHP_SELF'] ?>?atari=1&amiga=2&commodore=3">Reload with query string</a>

<?php
    require('../foot.php');
?>

