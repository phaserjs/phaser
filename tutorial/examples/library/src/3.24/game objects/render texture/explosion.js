var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    },
    width: 800,
    height: 600
};

var game = new Phaser.Game(config);

var rt;
var blast;
var nukeFX;

function preload() 
{
    this.load.image('fire', 'assets/particles/muzzleflash3.png');
    this.load.image('smoke', 'assets/particles/smoke-puff.png');
}

function create() 
{
    rt = this.make.renderTexture({ x: 0, y: 0, width: 800, height: 600 });

    blast = this.add.follower(null, 50, 350, 'smoke');

    var curve = new Phaser.Curves.Spline([200, 500, 600, 500, 625, 475, 200, 500, 400, 500, 400, 250]);

    blast.setPath(curve);

    nukeFX = this.tweens.add({
        targets: blast,
        scaleX: 8,
        scaleY: 8,
        alpha: 0,
        duration: 1500,
        ease: "Bounce.easeInOut",
        onComplete: function () { rt.clear(); blast.alpha = 0 },
        paused: true
    });

    nukeFX.setCallback('onUpdate', draw, [], this);

    this.input.on('pointerdown', function (pointer)
    {
        detonate(pointer.x, pointer.y);

    }, this);
}

function detonate(x, y) 
{
    blast.setPosition(x, y).setScale(1).setAlpha(1);

    blast.startFollow(200);

    nukeFX.restart();
}

function draw() 
{
    blast.setRotation(Math.random() * 4 -2);

    blast.setTexture(Math.random() < 0.8 ? 'fire' : 'smoke');

    rt.draw(blast);
}
