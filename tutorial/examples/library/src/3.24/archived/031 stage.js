
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('giant', 'assets/pics/giant.png');
    game.load.image('gem', 'assets/sprites/gem.png');

}

var image;

function create() {

    // image = game.add.image(0, 0, 'gem', null, game.stage);

    game.add.image(0, 0, 'gem', null, game.stage);
    game.add.image(100, 0, 'gem', null, game.stage);
    game.add.image(200, 0, 'gem', null, game.stage);
    game.add.image(300, 0, 'gem', null, game.stage);
    game.add.image(400, 0, 'gem', null, game.stage);
    game.add.image(500, 0, 'gem', null, game.stage);
    game.add.image(0, 200, 'gem', null, game.stage);
    game.add.image(100, 200, 'gem', null, game.stage);
    game.add.image(200, 200, 'gem', null, game.stage);
    game.add.image(300, 200, 'gem', null, game.stage);
    game.add.image(400, 200, 'gem', null, game.stage);
    game.add.image(500, 200, 'gem', null, game.stage);

    // image = new Phaser.GameObject.Image(game, 0, 0, 'giant');
    // game.stage.children.add(image);

    // game.stage.angle = 45;
    game.stage.x = 100;
    game.stage.y = 100;
    game.stage.scaleX = 2;

    console.dir(game.stage);

    // image.anchor = 0.5;
    // game.add.tween(image).to({ x: 700, angle: 90, scale: 2 }, 2000, 'Linear', true, 0, -1, true);

    // game.input.onDown.add(click, this);

}

function click () {

    // image.y = game.world.randomY;

}

function update () {

    // image.transform.update();

}
