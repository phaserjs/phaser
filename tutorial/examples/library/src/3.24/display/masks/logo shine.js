var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 1024,
    height: 768,
    backgroundColor: '#1d0b1c',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('grid', 'assets/skies/grid.png');
    this.load.image('logo', 'assets/tests/masks/phaser.png');
    this.load.image('chromeMask', 'assets/tests/masks/chrome-mask.png');
    this.load.image('blueFlare', 'assets/particles/blue-flare.png');
    this.load.image('whiteFlare', 'assets/particles/white-flare.png');
    this.load.image('fog', 'assets/tests/masks/fog.png');
    this.load.image('planet', 'assets/tests/masks/blue-planet.png');
    this.load.image('ship', 'assets/tests/masks/ship.png');
    this.load.image('raster', 'assets/demoscene/multi-color-raster.png');
    this.load.image('rezero', 'assets/pics/rezero-cast.png');
    this.load.image('mask2', 'assets/particles/glass.png');
}

function create ()
{
    var planet = this.add.image(512, 400, 'planet').setScale(0.8);

    var fogmask = this.make.sprite({
        x: 2024,
        y: 250,
        key: 'fog',
        add: false
    });

    planet.mask = new Phaser.Display.Masks.BitmapMask(this, fogmask);

    this.add.image(512, 768, 'grid').setOrigin(0.5, 1);

    var logo = this.add.image(512, 384, 'logo');

    var logomask = this.make.sprite({
        x: 516,
        y: 372,
        key: 'chromeMask',
        add: false
    });

    var raster = this.add.tileSprite(512, 400, 1024, 200, 'raster').setAlpha(0);

    raster.mask = new Phaser.Display.Masks.BitmapMask(this, logomask);

    var particles = this.add.particles('whiteFlare');

    var emitter = particles.createEmitter({
        lifespan: 1000,
        speed: { min: 100, max: 200 },
        angle: 240,
        gravityY: 300,
        rotate: { start: 0, end: 360 },
        scale: { start: 0.5, end: 0 },
        blendMode: 'ADD'
    });

    var flare1 = this.add.image(-400, 300, 'whiteFlare').setBlendMode('ADD');
    var flare2 = this.add.image(-400, 300, 'blueFlare').setBlendMode('ADD');
    var ship = this.add.image(-350, 300, 'ship');

    emitter.startFollow(flare1);

    var rezero = this.add.image(512, 620, 'rezero');

    var particles2 = this.make.particles({
        key: 'mask2',
        add: false
    });

    //  740 x 247 (370 x 123)
    var shape = new Phaser.Geom.Rectangle(rezero.x + 120, rezero.y - 60, rezero.width / 4, rezero.height / 3);

    particles2.createEmitter({
        emitZone: { type: 'random', source: shape },
        lifespan: 4000,
        speed: 140,
        angle: { min: 160, max: 200 },
        rotate: { start: 0, end: 200 },
        scale: { start: 0.8, end: 0 }
    });

    rezero.mask = new Phaser.Display.Masks.BitmapMask(this, particles2);

    this.tweens.add({
        targets: [ flare1, flare2, ship ],
        x: 2000,
        duration: 6000,
        ease: 'Power1',
        repeat: -1
    });

    this.tweens.add({
        targets: raster,
        props: {
            tilePositionY: { value: -700, duration: 6300, yoyo: true, repeat: -1, repeatDelay: 2000 },
            alpha: { value: 0.8, duration: 4000, yoyo: true, repeat: -1, delay: 4000, hold: 10000, repeatDelay: 2000 },
        },
        ease: 'Sine.easeInOut'
    });

    this.tweens.add({
        targets: fogmask,
        x: -2000,
        duration: 30000,
        ease: 'Linear',
        repeat: -1,
        repeatDelay: 1000
    });
}
