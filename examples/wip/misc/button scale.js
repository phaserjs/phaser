
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, render: render });

function preload() {

    // Enable scaling 
    // game.stage.scaleMode = Phaser.StageScaleMode.SHOW_ALL;
    // game.stage.scale.maxWidth = 1500;
    // game.stage.scale.maxHeight = 1000;
    // game.stage.scale.startFullScreen();
    // game.stage.scale.refresh();

    game.load.spritesheet('button', 'assets/buttons/button_sprite_sheet.png', 193, 71);

    game.load.image('sky0','assets/skies/space2.png');
    game.load.image('sky1','assets/skies/cavern1.png');
    game.load.image('sky2','assets/skies/chrome.png');
    game.load.image('sky3','assets/skies/fire.png');
    game.load.image('sky4','assets/skies/fog.png');
    game.load.image('sky5','assets/skies/sky1.png');
    game.load.image('sky6','assets/skies/toxic.png');

}

var background;
var button1;
var button2;
var button3;
var button4;
var button5;
var button6;

function create() {

    console.log('create!');

    background = game.add.sprite(0, 0, 'sky0');
    background.name = 'background';

    //  Standard button (also used as our pointer tracker)
    button1 = game.add.button(100, 100, 'button', changeSky, this, 2, 1, 0);
    button1.name = 'sky1';
    button1.anchor.setTo(0.5, 0.5);

    //  Rotated button
    button2 = game.add.button(330, 200, 'button', changeSky, this, 2, 1, 0);
    button2.name = 'sky2';
    button2.angle = 24;
    button2.anchor.setTo(0.5, 0.5);

    //  Width scaled button
    button3 = game.add.button(100, 300, 'button', changeSky, this, 2, 1, 0);
    button3.name = 'sky3';
    button3.width = 300;
    button3.anchor.setTo(0, 0.5);
    // button3.angle = 0.1;

    //  Scaled button
    button4 = game.add.button(300, 450, 'button', changeSky, this, 2, 1, 0);
    button4.name = 'sky4';
    button4.scale.setTo(2, 2);

    //  Shrunk button
    button5 = game.add.button(100, 450, 'button', changeSky, this, 2, 1, 0);
    button5.name = 'sky5';
    button5.scale.setTo(0.5, 0.5);

    //  Scaled and Rotated button
    button6 = game.add.button(570, 200, 'button', changeSky, this, 2, 1, 0); // anchor 0.5
    button6.name = 'sky6';
    button6.angle = 32;
    button6.scale.setTo(2, 2);
    button6.anchor.setTo(0.5, 0.5);

    //  works regardless of world angle, parent angle or camera position
    // game.world.setBounds(0, 0, 2000, 2000);
    // game.world.angle = 10;
    // game.camera.x = 300;
    
    // Phaser.Canvas.setSmoothingEnabled(false);

    //game.input.onDown.add(gofull, this);

}

function gofull() {

    game.stage.scale.startFullScreen(false);

}

function changeSky (button) {

    background.loadTexture(button.name);

}

function render () {

    // game.debug.spriteCorners(button1, false, true);
    // game.debug.spriteCorners(button2, false, true);
    // game.debug.spriteCorners(button3, false, true);
    // game.debug.spriteCorners(button4, false, true);
    // game.debug.spriteCorners(button5, false, true);
    // game.debug.spriteCorners(button6, false, true);

    // game.debug.text('sx: ' + button3.scale.x + ' sy: ' + button3.scale.y + ' w: ' + button3.width + ' cw: ' + button3._cache.width, 32, 20);
    // game.debug.text('ox: ' + game.stage.offset.x + ' oy: ' + game.stage.offset.y, 32, 20);
    // game.debug.point(button3.input._tempPoint);
    // game.debug.point(button6.input._tempPoint);

   game.debug.inputInfo(32, 32);

}
