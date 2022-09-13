
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

function addSprites (container, qty, key) {

    for (var s = 0; s < qty; s++)
    {
        var x = 600 + (Math.sin(s) * 16);
        var y = s * 8;

        var image = game.add.image(x, y, key, 0, container);
    }

}

function create() {

    game.renderer.enableMultiTextureSupport(['ball1', 'ball2', 'ball3', 'ball4', 'ball5']);

    container1 = game.add.container(game.stage, 0, 0, 'container1');

    container2 = game.add.container(container1, 0, 0, 'container2');

    container3 = game.add.container(container2, 0, 0, 'container3');

    container4 = game.add.container(container3, 0, 0, 'container4');

    container5 = game.add.container(container4, 0, 0, 'container5');

    addSprites(container1, 80, 'ball1');
    addSprites(container2, 80, 'ball2');
    addSprites(container3, 80, 'ball3');
    addSprites(container4, 80, 'ball4');
    addSprites(container5, 80, 'ball5');

    game.add.tween(container1).to( { x: -100 }, 3000, "Sine.easeInOut", true, 0, -1, true);
    game.add.tween(container2).to( { x: -100 }, 3000, "Sine.easeInOut", true, 0, -1, true);
    game.add.tween(container3).to( { x: -100 }, 3000, "Sine.easeInOut", true, 0, -1, true);
    game.add.tween(container4).to( { x: -100 }, 3000, "Sine.easeInOut", true, 0, -1, true);
    game.add.tween(container5).to( { x: -100 }, 3000, "Sine.easeInOut", true, 0, -1, true);

}

function update() {


}