
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
var frame;
var x = 0;
var y = 0;
var anchor = new Phaser.Point();

function create() {

    manager = new Phaser.TextureManager(game);

    texture = manager.addAtlasJSONArray(
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

    //  This frame is in the 1st atlas file (set0/data0)
    // frame = texture.get('aya_touhou_teng_soldier');

    //  This frame is in the 2nd atlas file (set1/data1)
    // frame = texture.get('oz_pov_melting_disk');

    //  This frame is in the 3rd atlas file (set2/data2)
    // frame = texture.get('budbrain_chick');

    //  This frame is in the 4th atlas file (set3/data3)
    // frame = texture.get('shocktroopers_toy');

    // frame = manager.get('megaset', 'aya_touhou_teng_soldier');
    frame = manager.getFrame('megaset', 'aya_touhou_teng_soldier');

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

}
