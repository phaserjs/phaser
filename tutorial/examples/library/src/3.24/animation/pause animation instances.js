var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.atlas('gems', 'assets/tests/columns/gems.png', 'assets/tests/columns/gems.json');
}

function create ()
{
    this.add.text(400, 32, 'Click to pause all Square animation instances', { color: '#00ff00' }).setOrigin(0.5, 0);

    var diamond = this.anims.create({ key: 'diamond', frames: this.anims.generateFrameNames('gems', { prefix: 'diamond_', end: 15, zeroPad: 4 }), repeat: -1 });
    var prism = this.anims.create({ key: 'prism', frames: this.anims.generateFrameNames('gems', { prefix: 'prism_', end: 6, zeroPad: 4 }), repeat: -1 });
    var ruby = this.anims.create({ key: 'ruby', frames: this.anims.generateFrameNames('gems', { prefix: 'ruby_', end: 6, zeroPad: 4 }), repeat: -1 });
    var square = this.anims.create({ key: 'square', frames: this.anims.generateFrameNames('gems', { prefix: 'square_', end: 14, zeroPad: 4 }), repeat: -1 });

    //  square added twice just to make sure there are more of them
    var keys = [ 'diamond', 'prism', 'ruby', 'square', 'square' ];

    var x = 100;
    var y = 116;

    for (var i = 0; i < 35; i++)
    {
        this.add.sprite(x, y, 'gems').play(keys[Phaser.Math.Between(0, 4)]);

        x += 100;

        if (x === 800)
        {
            x = 100;
            y += 100;
        }
    }

    this.input.on('pointerdown', function () {

        //  Every sprite using the global 'square' animation will now pause,
        //  because we're pausing the Animation instance itself:

        if (square.paused)
        {
            square.resume();
        }
        else
        {
            square.pause();
        }

    });
}
