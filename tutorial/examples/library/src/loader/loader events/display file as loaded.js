var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var files = [];

files.push('atari400');
files.push('atari800');
files.push('atari800xl');
files.push('128x128');
files.push('128x128-v2');
files.push('a');
files.push('advanced_wars_land');
files.push('advanced_wars_tank');
files.push('amiga-cursor');
files.push('aqua_ball');
files.push('arrow');
files.push('arrows');
files.push('asteroids_ship');
files.push('asteroids_ship_white');
files.push('asuna_by_vali233');
files.push('atari1200xl');
files.push('b');
files.push('baddie_cat_1');
files.push('balls');
files.push('beball1');
files.push('bikkuriman');
files.push('block');
files.push('blue_ball');
files.push('bluebar');
files.push('bluemetal_32x32x4');
files.push('bobs-by-cleathley');
files.push('bsquadron1');
files.push('bsquadron2');
files.push('bsquadron3');
files.push('budbrain_chick');
files.push('bullet');
files.push('bunny');
files.push('cakewalk');
files.push('car');
files.push('carrot');
files.push('centroid');
files.push('chain');
files.push('chick');
files.push('chunk');
files.push('clown');
files.push('coin');
files.push('cokecan');
files.push('columns-blue');
files.push('columns-orange');
files.push('columns-red');
files.push('copy-that-floppy');
files.push('crate');
files.push('crate32');
files.push('cursor-rotate');
files.push('darkwing_crazy');
files.push('default');
files.push('diamond');
files.push('dragcircle');
files.push('drawcursor');
files.push('dude');
files.push('eggplant');
files.push('elephant');
files.push('enemy-bullet');
files.push('exocet_spaceman');
files.push('explosion');
files.push('eyes');
files.push('firstaid');
files.push('flectrum');
files.push('flectrum2');
files.push('fork');
files.push('fuji');
files.push('gameboy_seize_color_40x60');
files.push('gem');
files.push('gem-blue-16x16x4');
files.push('gem-green-16x16x4');
files.push('gem-red-16x16x4');
files.push('ghost');
files.push('green_ball');
files.push('healthbar');
files.push('helix');
files.push('hello');
files.push('hotdog');
files.push('humstar');
files.push('ilkke');
files.push('interference_ball_48x48');
files.push('interference_tunnel');
files.push('jets');
files.push('kirito_by_vali233');
files.push('lemming');
files.push('loop');
files.push('maggot');
files.push('master');
files.push('melon');
files.push('mine');
files.push('mouse_jim_sachs');
files.push('mushroom');
files.push('mushroom2');
files.push('onion');
files.push('orange-cat1');
files.push('orange-cat2');
files.push('orb-blue');
files.push('orb-green');
files.push('orb-red');
files.push('oz_pov_melting_disk');
files.push('palm-tree-left');
files.push('palm-tree-right');
files.push('pangball');
files.push('parsec');
files.push('particle1');
files.push('pepper');
files.push('phaser');
files.push('phaser-dude');
files.push('phaser-ship');
files.push('phaser_tiny');
files.push('phaser1');
files.push('phaser2');
files.push('pineapple');
files.push('plane');
files.push('platform');
files.push('player');
files.push('purple_ball');
files.push('ra_dont_crack_under_pressure');
files.push('rain');
files.push('red_ball');
files.push('rgblaser');
files.push('saw');
files.push('shinyball');
files.push('ship');
files.push('shmup-baddie');
files.push('shmup-baddie-bullet');
files.push('shmup-baddie2');
files.push('shmup-baddie3');
files.push('shmup-boom');
files.push('shmup-bullet');
files.push('shmup-ship');
files.push('shmup-ship2');
files.push('skull');
files.push('snowflake-pixel');
files.push('sonic');
files.push('sonic_havok_sanity');
files.push('soundtracker');
files.push('space-baddie');
files.push('space-baddie-purple');
files.push('spaceman');
files.push('speakers');
files.push('spikedball');
files.push('spinObj_01');
files.push('spinObj_02');
files.push('spinObj_03');
files.push('spinObj_04');
files.push('spinObj_05');
files.push('spinObj_06');
files.push('spinObj_07');
files.push('spinObj_08');
files.push('splat');
files.push('steelbox');
files.push('strip1');
files.push('strip2');
files.push('tetrisblock1');
files.push('tetrisblock2');
files.push('tetrisblock3');
files.push('thrust_ship');
files.push('thrust_ship2');
files.push('tinycar');
files.push('tomato');
files.push('treasure_trap');
files.push('tree-european');
files.push('ufo');
files.push('vu');
files.push('wabbit');
files.push('wasp');
files.push('wizball');
files.push('x2kship');
files.push('xenon2_bomb');
files.push('xenon2_ship');
files.push('yellow_ball');
files.push('zelda-hearts');
files.push('zelda-life');

var game = new Phaser.Game(config);

function preload ()
{
    this.load.setPath('assets/sprites/');

    this.load.on('filecomplete', showFile, this);

    this.load.image('atari130xe');
}

function create ()
{
}

function showFile (key, type, texture)
{
    var x = Phaser.Math.Between(0, 800);
    var y = Phaser.Math.Between(0, 600);

    this.add.image(x, y, key);

    var nextFile = files.pop();

    if (nextFile)
    {
        this.load.image(nextFile);
    }
}
