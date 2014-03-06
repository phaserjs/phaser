
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

var tilesprite;
var cursors;

function preload() {

    game.load.image('starfield', 'assets/misc/starfield.jpg');
    game.load.spritesheet('mummy', 'assets/sprites/metalslug_mummy37x45.png', 37, 45, 18);
    game.load.atlas('seacreatures', 'assets/sprites/seacreatures_json.png', 'assets/sprites/seacreatures_json.json');

}

var sprite;

function create() {

    // sprite = game.add.tileSprite(0, 0, 800, 600, 'starfield');

    // sprite = game.add.tileSprite(100, 100, 400, 300, 'starfield');

    sprite = game.add.tileSprite(100, 100, 400, 300, 'mummy');
    sprite.pivot.setTo(200, 200);

    sprite.animations.add('walk');

    sprite.animations.play('walk', 20, true);

    cursors = game.input.keyboard.createCursorKeys();

}

function update() {

    sprite.rotation += 0.01;

    if (cursors.left.isDown)
    {
        sprite.tilePosition.x += 8;
        sprite.x -= 4;
    }
    else if (cursors.right.isDown)
    {
        sprite.tilePosition.x -= 8;
        sprite.x += 4;
    }

    if (cursors.up.isDown)
    {
        sprite.tilePosition.y += 8;
    }
    else if (cursors.down.isDown)
    {
        sprite.tilePosition.y -= 8;
    }

}

function render() {

    game.debug.text(sprite.frame, 32, 32);

}
