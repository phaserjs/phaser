var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    pixelArt: true,
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
    //  Define the animations first

    this.anims.create({ key: 'ruby', frames: this.anims.generateFrameNames('gems', { prefix: 'ruby_', end: 6, zeroPad: 4 }), repeat: -1 });
    this.anims.create({ key: 'square', frames: this.anims.generateFrameNames('gems', { prefix: 'square_', end: 14, zeroPad: 4 }), repeat: -1 });

    //  The Sprite config

    const config = {
        key: 'gems',
        x: { randInt: [ 0, 800 ] },
        y: { randInt: [ 0, 300 ] },
        scale: { randFloat: [ 0.5, 1.5 ] },
        anims: 'ruby'
    };

    //  Make 16 sprites using the config above
    for (var i = 0; i < 16; i++)
    {
        this.make.sprite(config);
    }

    //  A more complex animation config object.
    //  This time with a call to delayedPlay that's a function.
    const config2 = {
        key: 'gems',
        frame: 'square_0000',
        x: { randInt: [ 0, 800 ] },
        y: { randInt: [ 300, 600 ] },
        scale: { randFloat: [ 0.5, 1.5 ] },
        anims: {
            key: 'square',
            repeat: -1,
            repeatDelay: { randInt: [ 1000, 4000 ] },
            delayedPlay: function ()
            {
                return Math.random() * 6000;
            }
        }
    };

    //  Make 16 sprites using the config above
    for (let i = 0; i < 16; i++)
    {
        this.make.sprite(config2);
    }
}
