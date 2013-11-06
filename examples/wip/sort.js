var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('phaser', 'assets/sprites/phaser-dude.png');
    game.load.spritesheet('veggies', 'assets/sprites/fruitnveg32wh37.png', 32, 32);

}

var sprite;
var group;
var oldY = 0;

function create() {

    game.stage.backgroundColor = '#2d2d2d';

    // sprite = game.add.sprite(32, 200, 'phaser');
    // sprite.name = 'phaser-dude';

    group = game.add.group();

    sprite = group.create(300, 200, 'phaser');
    sprite.name = 'phaser-dude';

    for (var i = 0; i < 10; i++)
    {
        var c = group.create(game.world.randomX, game.world.randomY, 'veggies', game.rnd.integerInRange(0, 36));
        c.name = 'veg' + i;
    }

    game.input.onUp.add(sortGroup, this);
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.UP, Phaser.Keyboard.DOWN ]);

}

function sortGroup () {

    console.log('%c                                                                                                ', 'background: #efefef');
    // group.dump(true);
    group.sort();
    // group.dump(true);

}

function update() {

    sprite.body.velocity.x = 0;
    sprite.body.velocity.y = 0;

    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
    {
        sprite.body.velocity.x = -200;
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
    {
        sprite.body.velocity.x = 200;
    }

    if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
    {
        sprite.body.velocity.y = -200;
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
    {
        sprite.body.velocity.y = 200;
    }

    if (sprite.y !== oldY)
    {
        // console.log('sorted');
        // group.sort();
        // oldY = sprite.y;
    }

}

function render() {

    game.debug.renderText(sprite.y, 32, 32);
    // game.debug.renderInputInfo(32, 32);

}