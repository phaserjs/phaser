
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create });

function preload() {

    game.load.atlas('atlas', 'assets/sprites/atlas_json_array_trimmed.png', 'assets/sprites/atlas_json_array_trimmed.json');

}

var wizball;
// var chick;
// var mech;
// var robot;
// var cop;

function create() {

    game.stage.backgroundColor = '#404040';

    //  This demonstrates pixel perfect click detection even if using sprites in a texture atlas.

    // chick = game.add.sprite(64, 64, 'atlas');
    // chick.frameName = 'budbrain_chick.png';
    // chick.inputEnabled = true;
    // chick.input.pixelPerfect = true;
    // chick.input.useHandCursor = true;

    // cop = game.add.sprite(600, 64, 'atlas');
    // cop.frameName = 'ladycop.png';
    // cop.inputEnabled = true;
    // cop.input.pixelPerfect = true;
    // cop.input.useHandCursor = true;

    // robot = game.add.sprite(50, 300, 'atlas');
    // robot.frameName = 'robot.png';
    // robot.inputEnabled = true;
    // robot.input.pixelPerfect = true;
    // robot.input.useHandCursor = true;

    wizball = game.add.sprite(100, 400, 'atlas', 'wizball');
    wizball.inputEnabled = true;
    wizball.input.pixelPerfect = true;
    wizball.input.useHandCursor = true;

    // mech = game.add.sprite(250, 100, 'atlas');
    // mech.frameName = 'titan_mech.png';
    // mech.inputEnabled = true;
    // mech.input.pixelPerfect = true;
    // mech.input.useHandCursor = true;

}
