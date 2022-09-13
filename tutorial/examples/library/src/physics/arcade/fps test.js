var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'arcade'
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};  

var source;
var debug;
var complete = false;
var start = 0;
var end = 0;

new Phaser.Game(config);

function preload ()
{
    this.load.image('flower', 'assets/sprites/flower-exo.png');
}

function create ()
{
    // this.physics.world.setFPS(30);
    // this.physics.world.setFPS(60);
    this.physics.world.setFPS(120);

    source = this.physics.add.image(0, 300, 'flower');

    this.input.on('pointerdown', function (pointer) {

        start = pointer.time;

        source.body.setVelocityX(100);

    }, this);

    debug = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });
}

function update (time)
{
    if (!complete)
    {
        end = time;
    }

    debug.setText([
        'Duration: ' + ((complete) ? (end - start) : 0),
        'ETA: 2000'
    ]);

    if (source.x >= 200 && source.body.velocity.x > 0)
    {
        complete = true;
        source.body.setVelocityX(0);
    }
}
