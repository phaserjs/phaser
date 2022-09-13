var config = {
    type: Phaser.CANVAS,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    backgroundColor: '#2d2d2d',
    useTicker: true,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var image;
var time;
var delta;
var speed = (600 / 2) / 1000;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('bunny', 'assets/sprites/bunny.png');
    this.load.atlas('gems', 'assets/tests/columns/gems.png', 'assets/tests/columns/gems.json');
}

function create ()
{
    delta = this.add.text(32, 32);
    time = this.add.text(500, 400);

    image = this.add.image(0, 200, 'bunny');

    this.anims.create({ key: 'diamond', frames: this.anims.generateFrameNames('gems', { prefix: 'diamond_', end: 15, zeroPad: 4 }), repeat: -1 });
    this.anims.create({ key: 'prism', frames: this.anims.generateFrameNames('gems', { prefix: 'prism_', end: 6, zeroPad: 4 }), repeat: -1 });
    this.anims.create({ key: 'ruby', frames: this.anims.generateFrameNames('gems', { prefix: 'ruby_', end: 6, zeroPad: 4 }), repeat: -1 });
    this.anims.create({ key: 'square', frames: this.anims.generateFrameNames('gems', { prefix: 'square_', end: 14, zeroPad: 4 }), repeat: -1 });

    this.add.sprite(400, 100, 'gems').play('diamond');
    this.add.sprite(400, 200, 'gems').play('prism');
    this.add.sprite(400, 300, 'gems').play('ruby');
    this.add.sprite(400, 400, 'gems').play('square');
}

function update (timestep, dt)
{
    image.x += speed * dt;

    if (image.x > 1000)
    {
        image.x = 0;
    }

    time.setText('time: ' + this.sys.game.loop.time.toString());

    delta.setText(this.sys.game.loop.deltaHistory);
}
