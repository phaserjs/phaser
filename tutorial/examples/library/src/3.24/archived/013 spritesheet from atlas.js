
var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, render: render });

function preload() {

    game.load.image('set0', 'assets/atlas/megasetHD-0.png');
    game.load.image('set1', 'assets/atlas/megasetHD-1.png');
    game.load.image('set2', 'assets/atlas/megasetHD-2.png');
    game.load.image('set3', 'assets/atlas/megasetHD-3.png');

    game.load.json('data0', 'assets/atlas/megasetHD-0.json');
    game.load.json('data1', 'assets/atlas/megasetHD-1.json');
    game.load.json('data2', 'assets/atlas/megasetHD-2.json');
    game.load.json('data3', 'assets/atlas/megasetHD-3.json');

}

var manager;
var texture;
var megaset;
var frame;
var f = 0;
var x = 0;
var y = 0;
var anchor = new Phaser.Point();

function create() {

    manager = new Phaser.TextureManager(game);

    //  Here we create a Texture called 'megaset' which consists of
    //  4 PNGs and 4 sets of atlas data - it's massive! and it contains
    //  bitmap fonts, sprite sheets, and all kinds of stuff.

    megaset = manager.addAtlasJSONArray(
        'megaset',
        [
            game.cache.getImage('set0'),
            game.cache.getImage('set1'),
            game.cache.getImage('set2'),
            game.cache.getImage('set3')
        ],
        [
            game.cache.getJSON('data0'),
            game.cache.getJSON('data1'),
            game.cache.getJSON('data2'),
            game.cache.getJSON('data3')
        ]
    );

    //  Here we create a Sprite Sheet animation Texture, based on a frame embedded
    //  within the megaset texture. There are 22 frames in the animation, and it's
    //  also trimmed within the atlas (which is captured by the parsing logic)

    texture = megaset.getSpriteSheet('boom', 'explosion', 64, 64, 0, 22);

    frame = texture.get(0);

    // console.log(texture);
    // console.log(texture.frames);
    // console.log(frame);

    setInterval(function() {

        f++;

        if (f === texture.frameTotal)
        {
            f = 0;
        }

        frame = texture.get(f);

    }, 50);

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

}
