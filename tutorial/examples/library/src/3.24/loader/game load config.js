var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    loader: {
        baseURL: 'assets'
    },
    scene: {
        preload: preload,
        create: create,
        loader: {
            path: 'sprites'
        }
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    var progress = this.add.graphics();

    this.load.on('progress', function (value) {

        progress.clear();
        progress.fillStyle(0xffffff, 1);
        progress.fillRect(0, 270, 800 * value, 60);

    });

    this.load.on('complete', function () {

        progress.destroy();

    });

    //  Now let's load a huge stack of files!

    this.load.image('128x128');
    this.load.image('advanced_wars_tank');
    this.load.image('amiga-cursor');
    this.load.image('aqua_ball');
    this.load.image('arrow');
    this.load.image('asteroids_ship');
    this.load.image('asuna_by_vali233');
    this.load.image('atari130xe');
    this.load.image('atari400');
    this.load.image('atari800');
    this.load.image('atari800xl');
    this.load.image('atari1200xl');
    this.load.image('beball1');
    this.load.image('bikkuriman');
    this.load.image('block');
    this.load.image('blue_ball');
    this.load.image('bluebar');
    this.load.image('bsquadron1');
    this.load.image('bsquadron2');
    this.load.image('bsquadron3');
    this.load.image('budbrain_chick');
    this.load.image('bullet');
    this.load.image('bunny');
    this.load.image('cakewalk');
    this.load.image('car');
    this.load.image('carrot');
    this.load.image('centroid');
    this.load.image('chain');
    this.load.image('chick');
    this.load.image('chunk');
    this.load.image('clown');
    this.load.image('coin');
    this.load.image('cokecan');
    this.load.image('columns-blue');
    this.load.image('columns-orange');
    this.load.image('columns-red');
    this.load.image('copy-that-floppy');
    this.load.image('crate');
    this.load.image('crate32');
    this.load.image('cursor-rotate');
    this.load.image('darkwing_crazy');
    this.load.image('diamond');
    this.load.image('dude');
    this.load.image('eggplant');
    this.load.image('elephant');
    this.load.image('enemy-bullet');
    this.load.image('exocet_spaceman');
    this.load.image('explosion');
    this.load.image('eyes');
    this.load.image('firstaid');
    this.load.image('flectrum');
    this.load.image('flectrum2');
    this.load.image('fork');
    this.load.image('fuji');
    this.load.image('gem');
    this.load.image('ghost');
    this.load.image('green_ball');
    this.load.image('healthbar');
    this.load.image('helix');
    this.load.image('hello');
    this.load.image('hotdog');
    this.load.image('ilkke');
    this.load.image('interference_ball_48x48');
    this.load.image('kirito_by_vali233');
    this.load.image('lemming');
    this.load.image('loop');
    this.load.image('maggot');
    this.load.image('master');
    this.load.image('melon');
    this.load.image('mine');
    this.load.image('mouse_jim_sachs');
    this.load.image('mushroom');
    this.load.image('onion');
    this.load.image('orange-cat1');
    this.load.image('orange-cat2');
    this.load.image('orb-blue');
    this.load.image('orb-green');
    this.load.image('orb-red');
    this.load.image('oz_pov_melting_disk');
    this.load.image('palm-tree-left');
    this.load.image('palm-tree-right');
    this.load.image('pangball');
    this.load.image('parsec');
    this.load.image('pepper');
    this.load.image('phaser');
    this.load.image('phaser-dude');
    this.load.image('phaser-ship');
    this.load.image('phaser_tiny');
    this.load.image('phaser1');
    this.load.image('phaser2');
    this.load.image('pineapple');
    this.load.image('plane');
    this.load.image('platform');
    this.load.image('player');
    this.load.image('purple_ball');
    this.load.image('ra_dont_crack_under_pressure');
    this.load.image('rain');
    this.load.image('red_ball');
    this.load.image('rgblaser');
    this.load.image('saw');
    this.load.image('shinyball');
    this.load.image('ship');
    this.load.image('shmup-baddie');
    this.load.image('shmup-baddie-bullet');
    this.load.image('shmup-baddie2');
    this.load.image('shmup-baddie3');
    this.load.image('shmup-boom');
    this.load.image('shmup-bullet');
    this.load.image('shmup-ship');
    this.load.image('shmup-ship2');
    this.load.image('skull');
    this.load.image('slime');
    this.load.image('slimeeyes');
    this.load.image('snowflake-pixel');
    this.load.image('sonic');
    this.load.image('sonic_havok_sanity');
    this.load.image('space-baddie');
    this.load.image('spaceman');
    this.load.image('spikedball');
    this.load.image('spinObj_01');
    this.load.image('spinObj_02');
    this.load.image('spinObj_03');
    this.load.image('spinObj_04');
    this.load.image('spinObj_05');
    this.load.image('spinObj_06');
    this.load.image('spinObj_07');
    this.load.image('spinObj_08');
    this.load.image('splat');
    this.load.image('steelbox');
    this.load.image('tetrisblock1');
    this.load.image('tetrisblock2');
    this.load.image('tetrisblock3');
    this.load.image('thrust_ship');
    this.load.image('tinycar');
    this.load.image('tomato');
    this.load.image('treasure_trap');
    this.load.image('ufo');
    this.load.image('wabbit');
    this.load.image('wasp');
    this.load.image('wizball');
    this.load.image('x2kship');
    this.load.image('xenon2_bomb');
    this.load.image('xenon2_ship');
    this.load.image('yellow_ball');
    this.load.image('zelda-hearts');
    this.load.image('zelda-life');
}

function create ()
{
    var keys = this.textures.getTextureKeys();

    for (var i = 0; i < keys.length; i++)
    {
        var x = Phaser.Math.Between(0, 800);
        var y = Phaser.Math.Between(0, 600);

        this.add.image(x, y, keys[i]);
    }
}
