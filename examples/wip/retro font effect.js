
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('knightHawks', 'assets/fonts/retroFonts/KNIGHT3.png');

}

var font;

function create() {

    font = game.add.retroFont('knightHawks', 31, 25, Phaser.RetroFont.TEXT_SET6, 10, 1, 1);
    font.text = 'phaser v2';

    var i;
    var tween;

    for (var c = 0; c < 20; c++)
    {
        // var i = game.add.image(game.world.centerX, c * 32, font);
        var i = game.add.image(game.world.centerX + (c * 10), 32, font);
        // i.tint = Math.random() * 0xFFFFFF;
        i.anchor.set(0.5, 1);

        game.world.sendToBack(i);

        // tween = game.add.tween(i).to( { y: 500 }, 2000, Phaser.Easing.Quadratic.InOut, true, i * 100, 1000, true);

            // to: function (properties, duration, ease, autoStart, delay, repeat, yoyo) {

        tween = game.add.tween(i).to( { y: 500 }, 2000, Phaser.Easing.Sinusoidal.InOut);
        tween.delay(c * 10);
        tween.yoyo(true);
        tween.repeat(Number.MAX_SAFE_INTEGER);
        tween.interpolation(game.math.bezierInterpolation);
        tween.start();
    }

}

function update() {

	// font.text = "phaser x: " + game.input.x + " y: " + game.input.y;

}
