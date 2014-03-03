
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, render: render });

function preload() {

    //  Using Phasers asset loader we load up a PNG from the assets folder
    game.load.image('sprite', 'assets/sprites/parsec.png');

}

var sprite;

function create() {

    game.stage.backgroundColor = 'rgb(85,85,85)';

    sprite = game.add.sprite(200, 400, 'sprite');

    //  Enable Input detection. Sprites have this disabled by default, 
    //  so you have to start it if you want to interact with them.
    sprite.inputEnabled = true;

    //  This allows you to drag the sprite. The parameter controls if you drag from the position you touched it (false)
    //  or if it will snap to the center (true)
    sprite.input.enableDrag();

    //  This will lock the sprite so it can only be dragged horizontally, not vertically
    sprite.input.allowVerticalDrag = false;

}

function render() {

    game.debug.inputInfo(32, 32);
    game.debug.spriteInputInfo(sprite, 300, 32);

}
