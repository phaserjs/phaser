var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 200 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

new Phaser.Game(config);

var atari;
var block;
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
    atari = this.physics.add.image(400, 300, 'atari');
    atari.body.setAllowGravity(false);
    atari.body.setImmovable(true);

    block = this.physics.add.image(0, 0, 'block');
    block.setVelocity(200, 200);
    block.setBounce(1, 1);
    block.setCollideWorldBounds(true);

    gfx = this.add.graphics();

    text = this.add.text(0, 0, '-');

    // During a Body vs. Body collision or overlap both become 'touching'.
    // It's easier to see during an overlap:
    this.physics.add.overlap(atari, block);
    // this.physics.add.collider(atari, block);
}

function update()
{
    gfx.clear();

    draw(atari);
    draw(block);

    text.setText([
        'Box:',
        '',
        JSON.stringify(
            Phaser.Utils.Objects.Pick(
                block.body,
                ['blocked', 'touching', 'embedded']
            ),
            null,
            2
        )
    ]);
}

function draw(obj)
{
    gfx.lineStyle(5, 0xffff00, 0.8);

    drawFaces(obj.body, obj.body.touching);

    gfx.lineStyle(5, 0xff0000, 0.8);

    drawFaces(obj.body, obj.body.blocked);
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
