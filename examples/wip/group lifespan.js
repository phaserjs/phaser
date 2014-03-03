
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('atari1', 'assets/sprites/atari130xe.png');
    game.load.image('sonic', 'assets/sprites/sonic_havok_sanity.png');

}

var group1;
var group2;
var cursors;

function create() {

    group1 = game.add.group();
    group2 = game.add.group();

    //  Now let's create some random sprites and enable them all for drag and 'bring to top'
    var t;

    for (var i = 0; i < 10; i++)
    {
        t = group1.create(game.world.randomX, game.world.randomY, 'atari1');
        t.lifespan = 3000 + (Math.random() * 3000);

        group2.create(game.world.randomX, game.world.randomY, 'sonic');
    }

    cursors = game.input.keyboard.createCursorKeys();

}

function update() {

    if (cursors.left.isDown)
    {
        group1.x -= 4;
    }
    else if (cursors.right.isDown)
    {
        group1.x += 4;
    }

    if (cursors.up.isDown)
    {
        group2.y -= 4;
    }
    else if (cursors.down.isDown)
    {
        group2.y += 4;
    }

}

function render() {
    // game.debug.inputInfo(32, 32);
}
