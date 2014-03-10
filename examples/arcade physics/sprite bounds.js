
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.image('fuji', 'assets/pics/atari_fujilogo.png');
}

var fuji;
var b;

function create() {

    game.stage.backgroundColor = 'rgb(0,0,100)';

    fuji = game.add.sprite(game.world.centerX, game.world.centerY, 'fuji');
    fuji.anchor.setTo(0, 0.5);
    // fuji.angle = 34;

    b = new Phaser.Rectangle(fuji.width/2, fuji.height/2, fuji.width, fuji.height);

    //Remember that the sprite is rotating around its anchor
    game.add.tween(fuji).to({ angle: 360 }, 20000, Phaser.Easing.Linear.None, true, 0, true);

}

function update() {

    if (game.input.activePointer.justPressed())
    {
        fuji.position = game.input;
    }

    b.x = fuji.width/2 - fuji.width/2;
    b.y = fuji.height/2 - fuji.height/2;

}

function render() {

    game.debug.geom(b, 'rgba(0,20,91,1)');

}
