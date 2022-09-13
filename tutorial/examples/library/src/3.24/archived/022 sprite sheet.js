
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.spritesheet('monster', 'assets/sprites/metalslug_monster39x40.png', 39, 40);

}

var monster;
var f = 0;

function create() {

    monster = game.add.image(0, 0, 'monster', 0);

}

function update() {

    f++;

    if (f === monster.texture.frameTotal)
    {
        f = 0;
    }

    monster.frame = monster.texture.get(f);

}