
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, render: render });

function preload() {

    game.load.image('monster', 'assets/sprites/metalslug_monster39x40.png');

}

var manager;
var texture;
var frame;
var f = 0;
var x = 0;
var y = 0;
var anchor = new Phaser.Point();

function create() {

    manager = new Phaser.TextureManager(game);

    texture = manager.addSpriteSheet('monster', game.cache.getImage('monster'), 39, 40);

    frame = texture.get(0);

    // console.log(texture);
    // console.log(texture.frames);
    // console.log(frame);

}

function render () {

    var dx = frame.x - anchor.x * frame.width;
    var dy = frame.y - anchor.y * frame.height;

    game.context.drawImage(
        frame.source.image,
        frame.cutX,
        frame.cutY,
        frame.cutWidth,
        frame.cutHeight,
        x + dx,
        y + dy,
        frame.cutWidth,
        frame.cutHeight
    );

    f++;

    if (f === texture.frameTotal)
    {
        f = 0;
    }

    frame = texture.get(f);

}
