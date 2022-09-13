
var game = new Phaser.Game(800, 600, Phaser.WEBGL, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('ball1', 'assets/sprites/aqua_ball.png');
    game.load.image('ball2', 'assets/sprites/blue_ball.png');
    game.load.image('ball3', 'assets/sprites/red_ball.png');
    game.load.image('ball4', 'assets/sprites/purple_ball.png');
    game.load.image('ball5', 'assets/sprites/yellow_ball.png');

}

function between (min, max)
{
    return Math.floor(Math.random() * (max - min + 1) + min);
}

var container1;
var container2;
var container3;
var container4;
var container5;

function create() {

    game.renderer.enableMultiTextureSupport(['ball1', 'ball2', 'ball3', 'ball4', 'ball5']);

    for (var i = 1; i <= 5; i++)
    {
        window['container' + i] = game.add.container(game.stage, 400, 300, 'container' + i);
        window['container' + i].pivotX = 400;
        window['container' + i].pivotY = 300;

        //  Create some sprites
        for (var s = 0; s < 200; s++)
        {
            // var x = s;
            var x = between(350, 450);
            var y = between(-200, 800);

            var image = game.add.image(x, y, 'ball' + i, 0, window['container' + i]);
        }
    }

}

function update() {

    container1.rotation += 0.010;
    container2.rotation += 0.015;
    container3.rotation += 0.020;
    container4.rotation += 0.025;
    container5.rotation += 0.030;

}