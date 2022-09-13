var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            x: 200, y: 50, width: 400, height: 500
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var block1;
var block2;
var block3;
var flower;
var gfx;
var text;

function preload() 
{
    this.load.image('block', 'assets/sprites/block.png');
    this.load.image('flower', 'assets/sprites/flower-exo.png');
    this.load.image('atari', 'assets/sprites/atari800.png');
}

function create() 
{
    block1 = this.physics.add.image(400, 150, 'block');
    block2 = this.physics.add.image(400, 300, 'block');
    block3 = this.physics.add.staticImage(400, 450, 'block');
    flower = this.physics.add.image(400, 100, 'flower');

    block1.body.setImmovable(true);

    block2.body.setImmovable(true);

    // Will cause `blocked` (last).
    flower.setCollideWorldBounds(true);

    gfx = this.add.graphics();

    text = this.add.text(0, 0, '-');

    this.physics.add.collider(flower, [
        block1, // Will cause `embedded`
        block2, // Will cause `touching`
        block3  // Will cause `blocked` and `touching`
    ]);

    this.time.delayedCall(2000, function () 
    {
        block1.disableBody(true, true);
        flower.setGravity(0, 600);
    });

    this.time.delayedCall(4000, function () 
    {
        block2.disableBody(true, true);
    });

    this.time.delayedCall(6000, function () 
    {
        block3.disableBody(true, true);
    });
}

function update() 
{
    gfx.clear();
    gfx.lineStyle(1, 0x666666);
    gfx.strokeRectShape(this.physics.world.bounds);

    draw(block1);
    draw(block2);
    draw(block3);
    draw(flower);

    text.setText([
        'Flower:',
        '',
        JSON.stringify(
            Phaser.Utils.Objects.Pick(
                flower.body,
                ['blocked', 'touching', 'embedded']
            ),
            null,
            2
        )
    ]);
}

function draw(obj) 
{
    if (!obj.active) return;

    var body = obj.body;

    gfx.lineStyle(11, 0xffff00, 0.5);

    drawFaces(body, body.touching);

    gfx.lineStyle(11, 0xff0000, 0.5);

    drawFaces(body, body.blocked);

    if (body.embedded) 
    {
        gfx.lineStyle(5, 0x00ccff, 0.5);
        gfx.lineBetween(body.left, body.top, body.right, body.bottom);
        gfx.lineBetween(body.left, body.bottom, body.right, body.top);
    }
}

function drawFaces(body, faces) 
{
    if (faces.left) 
    {
        gfx.lineBetween(body.left, body.top, body.left, body.bottom);
    }

    if (faces.up) 
    {
        gfx.lineBetween(body.left, body.top, body.right, body.top);
    }

    if (faces.right) 
    {
        gfx.lineBetween(body.right, body.top, body.right, body.bottom);
    }

    if (faces.down) 
    {
        gfx.lineBetween(body.left, body.bottom, body.right, body.bottom);
    }
}
