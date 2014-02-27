
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('atari1', 'assets/sprites/atari130xe.png');
    game.load.image('sonic', 'assets/sprites/sonic_havok_sanity.png');
    game.load.image('starfield', 'assets/misc/starfield.jpg');
    game.load.bitmapFont('carrier', 'assets/fonts/carrier_command.png', 'assets/fonts/carrier_command.xml', null, 0, 24);
    game.load.spritesheet('button', 'assets/buttons/button_sprite_sheet.png', 193, 71);

}

var group;
var DaddyGroup;

function create() {

    DaddyGroup = game.add.group();

    group = game.add.group();

    //  Testing Group.destroy with different object types:

    var sprite = game.make.sprite(300, 100, 'atari1');

    var graphics = game.make.graphics(0, 0);
    graphics.beginFill(0xFF3300);
    graphics.moveTo(0,50);
    graphics.lineTo(250, 50);
    graphics.lineTo(100, 100);
    graphics.lineTo(250, 220);
    graphics.lineTo(50, 220);
    graphics.lineTo(0, 50);
    graphics.endFill();

    var tilesprite = game.make.tileSprite(600, 100, 200, 200, 'starfield');
    tilesprite.autoScroll(0, 100);

    var bitmaptext = game.make.bitmapText(100, 300, 'carrier', 'bitmap text', 32);

    var text = game.make.text(100, 350, "normal text");
    text.font = 'Arial Black';
    text.fontSize = 60;
    text.fill = '#ff0044';

    var button = game.make.button(100, 450, 'button', actionOnClick, this, 2, 1, 0);

    group.add(sprite);
    group.add(graphics);
    group.add(tilesprite);
    group.add(bitmaptext);
    group.add(text);
    group.add(button);

    DaddyGroup.add(group);

    game.input.onDown.add(actionOnClick, this);

}

function actionOnClick() {

    DaddyGroup.destroy();

}

function update() {
}

function render() {
}
