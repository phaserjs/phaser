var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    width: 800,
    height: 600
};

var game = new Phaser.Game(config);

var rt;
var rnd;
var t;

function preload()
{
    this.load.baseURL = "https://cdn.rawgit.com/samid737/samid737.github.io/eca38c92/409/";
    this.load.crossOrigin = 'anonymous';
    this.load.spritesheet('matrix', '/assets/sprites/font.png', { frameWidth: 110, frameHeight: 125, endFrame: 23 });
}

function create()
{
    rt = this.make.renderTexture({ x: 0, y: 0, width: 800, height: 600 });

    rnd = Math.random;
}

function update()
{
    for (i = 0; i < 20; i++)
    {
        draw();
    }

    t = this.time.now / 100000;

    this.cameras.main.shake(500, t / 100);
    this.cameras.main.setZoom(1 + t);
}

function draw()
{
    var alpha = rnd();
    var tint = (0x00ffff * (rnd() * 0.1 + 0.8));
    var frame = ~~(rnd() * 22);

    rt.drawFrame("matrix", frame, rnd() * 800, rnd() * 600, alpha, tint);
}