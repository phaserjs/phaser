
var game = new Phaser.Game(800, 600, Phaser.WEBGL, 'phaser-example', { preload: preload, create: create });

function preload() {

    game.load.image('bg', 'assets/skies/space1.png');
    game.load.image('logo', 'assets/sprites/phaser2.png');

    game.load.path = 'assets/atlas/';

    game.load.multiatlas('megaset', 
        ['megasetHD-0.png', 'megasetHD-1.png', 'megasetHD-2.png', 'megasetHD-3.png'],
        ['megasetHD-0.json', 'megasetHD-1.json', 'megasetHD-2.json', 'megasetHD-3.json']
    );

}

function create() {

    game.renderer.enableMultiTextureSupport(['megaset', 'bg', 'logo']);

    game.add.image(0, 0, 'bg', 0, game.stage);

    //  This frame is in the 1st atlas file (set0/data0)
    game.add.image(0, 0, 'megaset', 'aya_touhou_teng_soldier', game.stage);
    game.add.image(0, 400, 'megaset', 'atari800', game.stage);
    game.add.image(500, 0, 'megaset', 'beball1', game.stage);

    //  This frame is in the 2nd atlas file (set1/data1)
    game.add.image(180, 0, 'megaset', 'oz_pov_melting_disk', game.stage);

    //  This frame is in the 3rd atlas file (set2/data2)
    game.add.image(240, 0, 'megaset', 'budbrain_chick', game.stage);

    //  This frame is in the 4th atlas file (set3/data3)
    game.add.image(340, 0, 'megaset', 'shocktroopers_toy', game.stage);

    //  Separate image
    game.add.image(200, 200, 'logo', 0, game.stage);

}
