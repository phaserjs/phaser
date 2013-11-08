var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('atari', 'assets/sprites/atari130xe.png');
    game.load.image('mushroom', 'assets/sprites/mushroom2.png');

}

var sprite1;
var sprite2;

function create() {

    game.stage.backgroundColor = '#2d2d2d';

    //  This will check Sprite vs. Sprite collision

    sprite1 = game.add.sprite(300, 300, 'atari');
    sprite1.name = 'atari';
	sprite1.body.immovable = true;

    sprite1.anchor.setTo(0.5, 0.5);
    sprite1.pivot.x = 250;
    sprite1.pivot.y = 300;

    // sprite2 = game.add.sprite(0, 0, 'mushroom');
    // sprite2.name = 'mushroom';

}

function update() {

    sprite1.angle += 1;
    sprite1.pivot.x = game.input.x;
    sprite1.pivot.y = game.input.y;

}

function render() {

    game.debug.renderPixel(sprite1.pivot.x, sprite1.pivot.y);

    // game.debug.renderSpriteInfo(sprite1, 100, 400);
    game.debug.renderSpriteBounds(sprite1);
    // game.debug.renderSpriteInfo(sprite2, 100, 100);
    // game.debug.renderSpriteBounds(sprite2);
}

