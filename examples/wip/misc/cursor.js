var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('atari1', 'assets/sprites/atari130xe.png');
    game.load.image('atari2', 'assets/sprites/atari800xl.png');
    game.load.image('atari4', 'assets/sprites/atari800.png');
    game.load.image('sonic', 'assets/sprites/sonic_havok_sanity.png');
    game.load.image('duck', 'assets/sprites/darkwing_crazy.png');
    game.load.image('firstaid', 'assets/sprites/firstaid.png');
    game.load.image('diamond', 'assets/sprites/diamond.png');
    game.load.image('mushroom', 'assets/sprites/mushroom2.png');

}

var group;

function create() {

    group = game.add.group();

    var sprite1 = group.create(0, 200, 'atari1');
    sprite1.name = 'Atari 1';

    var sprite2 = group.create(300, 200, 'atari2');
    sprite2.name = 'Atari 2';

    var sprite3 = group.create(600, 200, 'atari4');
    sprite3.name = 'Atari 3';

    game.input.onDown.add(moveCursor, this);

    group.dump(false);

}

function moveCursor () {

    group.next();
    group.dump(false);

}

function update() {


}

function render() {

    game.debug.text(group.cursor.name, 32, 32);

    // game.debug.inputInfo(32, 32);

}