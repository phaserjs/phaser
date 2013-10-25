
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { create: create, update: update, render: render });

function create() {

    game.rnd.sow([123]);
    console.log('A');
    console.log(game.rnd.integer());
    console.log(game.rnd.integer());
    console.log(game.rnd.integer());
    console.log(game.rnd.integer());
    console.log(game.rnd.integer());

    game.rnd.sow([0]);
    console.log('B');
    console.log(game.rnd.integer());
    console.log(game.rnd.integer());
    console.log(game.rnd.integer());
    console.log(game.rnd.integer());
    console.log(game.rnd.integer());

    game.rnd.sow([123]);
    console.log('C');
    console.log(game.rnd.integer());
    console.log(game.rnd.integer());
    console.log(game.rnd.integer());
    console.log(game.rnd.integer());
    console.log(game.rnd.integer());
}

function update() {
}

function render() {
}
