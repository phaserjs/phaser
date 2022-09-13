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
var fireball;
var fireFX;

function preload()
{
    this.load.image('dude', 'assets/sprites/phaser-dude.png');
    this.load.image('fire', 'assets/particles/muzzleflash3.png');
}

function create()
{
    rt = this.make.renderTexture({ x: 0, y: 0, width: 800, height: 600 });

    player = this.add.image(100, 300, 'dude');

    fireball = this.add.follower(null, 50, 350, 'fire');

    fireFX = this.tweens.add({
        targets: fireball,
        scaleX: 3,
        scaleY: 3,        
        alpha: 0,
        duration: 300,
        ease: "Cubic.easeOut",
        onComplete: function () { rt.clear(); fireball.alpha = 0 },
        paused: true
    });

    fireFX.setCallback('onUpdate', draw, [], this);

    this.input.on('pointerdown', function (pointer)
    {
        generate(pointer.x, pointer.y);
    }, this);
}

function generate(x, y)
{
    fireball.setPosition(player.x, player.y).setScale(0.5).setAlpha(1);

    curve = new Phaser.Curves.Line(new Phaser.Math.Vector2(player.x, player.y), new Phaser.Math.Vector2(x, y));

    fireball.setPath(curve);
    fireball.startFollow(300);
    
    fireFX.restart();    
}

function draw()
{
    rt.draw(fireball);
}