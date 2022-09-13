var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var text;
var keys;
var cursors;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('bg', 'assets/pics/uv-grid-diag.png');
    this.load.image('block', 'assets/sprites/block.png');
}

function create ()
{
    this.cameras.main.setBounds(0, 0, 1024 * 2, 1024 * 2);

    this.add.image(0, 0, 'bg').setOrigin(0);
    this.add.image(1024, 0, 'bg').setOrigin(0);
    this.add.image(0, 1024, 'bg').setOrigin(0);
    this.add.image(1024, 1024, 'bg').setOrigin(0);

    cursors = this.input.keyboard.createCursorKeys();
    keys = this.input.keyboard.addKeys('W,A,S,D');

    // this.cameras.main.originX = 1;
    this.cameras.main.centerToBounds();

    text = this.add.text(32, 32).setScrollFactor(0).setFontSize(32).setColor('#ffffff');;
}

function update ()
{
    var cam = this.cameras.main;

    text.setText([
        'ScrollX: ' + cam.scrollX,
        'ScrollY: ' + cam.scrollY,
        'MidX: ' + cam.midPoint.x,
        'MidY: ' + cam.midPoint.y
    ]);

    if (keys.A.isDown)
    {
        cam.scrollX -= 6;
    }
    else if (keys.D.isDown)
    {
        cam.scrollX += 6;
    }

    if (keys.W.isDown)
    {
        cam.scrollY -= 6;
    }
    else if (keys.S.isDown)
    {
        cam.scrollY += 6;
    }

    if (cursors.left.isDown)
    {
        cam.rotation -= 0.01;
    }
    else if (cursors.right.isDown)
    {
        cam.rotation += 0.01;
    }

    if (cursors.up.isDown)
    {
    }
    else if (cursors.down.isDown)
    {
    }
}