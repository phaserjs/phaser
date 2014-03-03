
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

var robot;

function preload() {

    game.load.image('eye', 'assets/sprites/robot/eye.png');
    game.load.image('body', 'assets/sprites/robot/body.png');
    game.load.image('arm-l', 'assets/sprites/robot/arm-l.png');
    game.load.image('arm-r', 'assets/sprites/robot/arm-r.png');
    game.load.image('leg-l', 'assets/sprites/robot/leg-l.png');
    game.load.image('leg-r', 'assets/sprites/robot/leg-r.png');
    
}

function create() {

    // Use groups of sprites to create a big robot.
    // Robot itself, you can subclass group class in a real game.
    robot = game.add.group();

    robot.x = 300;
    robot.y = 200;

    robot.pivot.x = 300;
    robot.pivot.y = 300;

    // Robot components.
    robot.create(90, 175, 'arm-l');
    robot.create(549, 175, 'arm-r');
    robot.create(270, 325, 'leg-l');
    robot.create(410, 325, 'leg-r');
    robot.create(219, 32, 'body');
    robot.create(335, 173,'eye');

}

function update() {

    robot.rotation += 0.02;

}

function render() {
    
    game.debug.text('The robot is a group and every component is a sprite.', 240, 580);

}
