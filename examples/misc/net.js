
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { render: render });

function render () {

    game.debug.text('Host Name:'+game.net.getHostName(),game.world.centerX-300,20);
    game.debug.text('Host Name contains 192:'+game.net.checkDomainName('192'),game.world.centerX-300,40);
    game.debug.text('Host Name contains google.com:'+game.net.checkDomainName('google.com'),game.world.centerX-300,60);

    //  Add some values to the query string
    game.debug.text('Query string with new values : '+game.net.updateQueryString('atari', '520'),game.world.centerX-400,80);
    game.debug.text('Query string with new values : '+game.net.updateQueryString('amiga', '1200'),game.world.centerX-400,100);

    console.log('Query String: '+game.net.getQueryString(),game.world.centerX-300,140);
    console.log('Query String Param: '+game.net.getQueryString('atari'),game.world.centerX-300,160);

}
