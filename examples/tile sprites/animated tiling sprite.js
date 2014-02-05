
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {
    game.load.image('disk', 'assets/sprites/p2.jpeg');
}

var tilesprite;
var cursors;
var count = 0;

function create() {

    tilesprite = game.add.tileSprite(0, 0, 512, 512, 'disk');

    cursors = game.input.keyboard.createCursorKeys();

}

function update() {

    count += 0.005

    tilesprite.tileScale.x = 2 + Math.sin(count);
    tilesprite.tileScale.y = 2 + Math.cos(count);
    
    tilesprite.tilePosition.x += 1;
    tilesprite.tilePosition.y += 1;

    if (cursors.left.isDown)
    {
        tilesprite.x -= 4;
    }
    else if (cursors.right.isDown)
    {
        tilesprite.x += 4;
    }

    if (cursors.up.isDown)
    {
        tilesprite.y -= 4;
    }
    else if (cursors.down.isDown)
    {
        tilesprite.y += 4;
    }

}
