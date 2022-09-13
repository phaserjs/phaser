/* global dat */

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: { debug: true }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var sprite;

new Phaser.Game(config);

function preload ()
{
    this.load.image('mushroom', 'assets/sprites/mushroom2.png');
    this.load.image('block', 'assets/sprites/atari800.png');
}

function create ()
{
    sprite = this.physics.add.image(400, 300, 'mushroom')
        .setBounce(1, 1)
        .setVelocityX(300);

    var block = this.physics.add.staticImage(400, 450, 'block');

    this.physics.add.collider(sprite, block);

    createBodyGui(sprite.body);
}

function update ()
{
    this.physics.world.wrap(sprite);
}

function createBodyGui (body)
{
    var gui = new dat.GUI({ width: 600 });

    gui.add(body, 'allowDrag');
    gui.add(body, 'allowGravity');
    gui.add(body, 'allowRotation');
    gui.add(body, 'angularAcceleration', -360, 360, 5);
    gui.add(body, 'angularVelocity', -360, 360, 5);
    gui.add(body, 'collideWorldBounds');
    gui.add(body, 'debugShowBody');
    gui.add(body, 'debugShowVelocity');
    gui.add(body, 'enable');
    gui.add(body, 'immovable');
    gui.add(body, 'isCircle');
    gui.add(body, 'mass', 0.1, 10, 0.1);
    gui.add(body, 'moves');
    gui.add(body, 'useDamping');
    gui.addColor(body, 'debugBodyColor');

    createVectorGui(gui, 'acceleration', body.acceleration, -600, 600, 10);
    createVectorGui(gui, 'bounce', body.bounce, 0, 1, 0.1);
    createVectorGui(gui, 'deltaMax', body.deltaMax, 0, 60, 1);
    createVectorGui(gui, 'drag', body.drag, 0, 60, 0.1);
    createVectorGui(gui, 'friction', body.friction, 0, 1, 0.05);
    createVectorGui(gui, 'gravity', body.gravity, -600, 600, 10);
    createVectorGui(gui, 'maxVelocity', body.maxVelocity, 0, 10000, 100);
    createVectorGui(gui, 'velocity', body.velocity, -600, 600, 10);

    var check = gui.addFolder('checkCollision');
    check.add(body.checkCollision, 'left');
    check.add(body.checkCollision, 'up');
    check.add(body.checkCollision, 'right');
    check.add(body.checkCollision, 'down');

    return gui;
}

function createVectorGui (gui, name, vector, min, max, step)
{
    var folder = gui.addFolder(name);

    folder.add(vector, 'x', min, max, step);
    folder.add(vector, 'y', min, max, step);

    return folder;
}
