
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create });

function preload() {

    //  We load a TexturePacker JSON file and image and show you how to make several unique sprites from the same file
    game.load.atlas('atlas', 'assets/pics/texturepacker_test.png', 'assets/pics/texturepacker_test.json');

}

var chick;
var car;
var mech;
var robot;
var cop;

function create() {

    game.stage.backgroundColor = '#404040';

    chick = game.add.sprite(64, 64, 'atlas');

    //  You can set the frame based on the frame name (which TexturePacker usually sets to be the filename of the image itself)
    chick.frameName = 'budbrain_chick.png';

    //  Or by setting the frame index
    //chick.frame = 0;

    cop = game.add.sprite(600, 64, 'atlas');
    cop.frameName = 'ladycop.png';

    robot = game.add.sprite(50, 300, 'atlas');
    robot.frameName = 'robot.png';

    car = game.add.sprite(100, 400, 'atlas');
    car.frameName = 'supercars_parsec.png';

    mech = game.add.sprite(250, 100, 'atlas');
    mech.frameName = 'titan_mech.png';

}
