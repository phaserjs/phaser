var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var rt;
var bob;
var text;
var bunny;
var particles;
var bitmaptext;
var graphics;
var quad;
var tilesprite;
var blitter;

var iter = 0;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('bunny', 'assets/sprites/bunny.png');
    this.load.image('pic', 'assets/pics/baal-loader.png');
    this.load.atlas('flares', 'assets/particles/flares.png', 'assets/particles/flares.json');
    this.load.bitmapFont('desyrel', 'assets/fonts/bitmap/desyrel.png', 'assets/fonts/bitmap/desyrel.xml');
    this.load.image('image', 'assets/pics/sure-shot-by-made.png');
    this.load.image('mushroom', 'assets/sprites/mushroom2.png');
    this.load.image('atari', 'assets/sprites/atari130xe.png');
}

function create ()
{
    bunny = this.textures.getFrame('bunny');
    text = this.add.text(0, 0, 'phaser 3?').setVisible(false);
    bob = this.add.image(0, 0, 'bunny').setName('bob').setVisible(false);
    particles = this.add.particles('flares').setVisible(false);
    bitmaptext = this.add.bitmapText(0, 0, 'desyrel', 'PHASER 3\nRender Texture').setVisible(false);

    graphics = this.add.graphics().setVisible(false);

    graphics.fillStyle(0xffff00, 1);

    graphics.slice(400, 300, 200, Phaser.Math.DegToRad(340), Phaser.Math.DegToRad(20), true);

    graphics.fillPath();

    tilesprite = this.add.tileSprite(400, 300, 250, 250, 'mushroom').setVisible(false);

    blitter = this.add.blitter(0, 0, 'atari').setVisible(false);

    blitter.create(0, 0);

    particles.createEmitter({
        frame: 'blue',
        x: 200,
        y: 300,
        lifespan: 2000,
        speed: { min: 400, max: 600 },
        angle: 330,
        gravityY: 300,
        scale: { start: 0.4, end: 0 },
        quantity: 2,
        blendMode: 'ADD'
    });

    rt = this.add.renderTexture(0, 0, 800, 600);
}

function update ()
{
    rt.camera.rotation -= 0.01;

    rt.clear();

    rt.beginDraw();

    rt.batchDraw(graphics, 0, 0);
    rt.batchDraw(bob, 200, 200);
    rt.batchDraw(tilesprite, 200, 200);
    rt.batchDraw(blitter, 0, 0);
    rt.batchDraw(text, 100, 100);
    rt.batchDraw(bob, 300, 300);
    rt.batchDraw(bob, 400, 400);
    rt.batchDraw(text, 300, 200);
    rt.batchDraw(particles, 300, 0);
    rt.batchDraw(bitmaptext, 200, 100);

    rt.endDraw();

    tilesprite.tilePositionX = Math.cos(-iter) * 400;
    tilesprite.tilePositionY = Math.sin(-iter) * 400;

    iter += 0.01;
}
