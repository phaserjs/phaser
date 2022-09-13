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

    // console.log(bob.frame);

    // this.add.image(400, 300, 'pic').setAlpha(0.9);

    rt = this.add.renderTexture(0, 0, 800, 600);

    // console.log(rt.currentMatrix);

    // var rt = this.add.renderTexture(0, 0, 700, 500);

    // rt.draw(bunny, 0, 0);
    // rt.draw(bunny, 100, 100);
    // rt.draw(bunny, 200, 200);

    // bob.setAngle(30);

    // rt.camera.setAngle(30);

    // var rt = this.add.renderTexture(0, 0, 800, 600);

    // rt.draw(bob, 200, 200);
    // rt.draw(bob, 300, 300);
    // rt.draw(bob, 400, 400);
}

function update ()
{
    rt.camera.rotation -= 0.01;
    // rt.camera.zoom = 2;

    rt.clear();

    rt.draw(graphics, 0, 0);
    rt.draw(bob, 200, 200);
    rt.draw(tilesprite, 200, 200);
    rt.draw(blitter, 0, 0);
    rt.draw(text, 100, 100);
    rt.draw(bob, 300, 300);
    rt.draw(bob, 400, 400);
    rt.draw(text, 300, 200);
    rt.draw(particles, 300, 0);
    rt.draw(bitmaptext, 200, 100);

    tilesprite.tilePositionX = Math.cos(-iter) * 400;
    tilesprite.tilePositionY = Math.sin(-iter) * 400;

    iter += 0.01;

}
