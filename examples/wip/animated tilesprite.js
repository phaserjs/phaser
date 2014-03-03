
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

var tilesprite;
var cursors;
var count = 0;

function preload() {

    game.load.image('starfield', 'assets/misc/starfield.jpg');
    game.load.spritesheet('mummy', 'assets/sprites/metalslug_mummy37x45.png', 37, 45, 18);
    game.load.atlas('seacreatures', 'assets/sprites/seacreatures_json.png', 'assets/sprites/seacreatures_json.json');

}

var sprite;

function create() {

    // sprite = game.add.tileSprite(0, 0, 800, 600, 'starfield');
    // sprite = game.add.tileSprite(100, 100, 400, 300, 'starfield');


    // sprite = game.add.tileSprite(0, 0, 800, 600, 'mummy', 0);
    // sprite.animations.add('walk');
    // sprite.animations.play('walk', 20, true);

    // x = game.add.sprite(0, 0, 'mummy');
    // x.animations.add('walk');
    // x.animations.play('walk', 20, true);

    sprite = game.add.tileSprite(0, 0, 800, 600, 'seacreatures', 'octopus0000');
    sprite.animations.add('swim', Phaser.Animation.generateFrameNames('octopus', 0, 24, '', 4), 30, true);
    sprite.animations.play('swim');


    cursors = game.input.keyboard.createCursorKeys();

}

function update() {

    count += 0.005

    sprite.tileScale.x = 2 + Math.sin(count);
    sprite.tileScale.y = 2 + Math.cos(count);
    
    sprite.tilePosition.x += 1;
    sprite.tilePosition.y += 1;

    if (cursors.left.isDown)
    {
        sprite.tilePosition.x += 4;
    }
    else if (cursors.right.isDown)
    {
        sprite.tilePosition.x -= 4;
    }

    if (cursors.up.isDown)
    {
        sprite.tilePosition.y += 4;
    }
    else if (cursors.down.isDown)
    {
        sprite.tilePosition.y -= 4;
    }

}

function render() {

    // game.debug.text(sprite.frame, 32, 32);

}
