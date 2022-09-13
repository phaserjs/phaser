var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 1024,
    height: 600,
    backgroundColor: '#fafafa',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.atlas('cards', 'assets/atlas/cards.png', 'assets/atlas/cards.json');
}

function create ()
{
    //  Create a stack of random cards

    var frames = this.textures.get('cards').getFrameNames();

    var x = 0;
    var y = 0;

    for (var i = 0; i < 64; i++)
    {
        this.add.image(x, y, 'cards', Phaser.Math.RND.pick(frames)).setInteractive();

        x += 4;
        y += 4;
    }

    //  Shrink the main camera
    this.cameras.main.setSize(511, 299).setZoom(0.5).setBackgroundColor('#000000');

    //  3 more cams
    this.cameras.add(513, 0, 511, 299).setZoom(0.5).setBackgroundColor('#0000aa');
    this.cameras.add(0, 301, 511, 299).setZoom(0.5).setBackgroundColor('#00aa00');
    this.cameras.add(513, 301, 511, 299).setZoom(0.5).setBackgroundColor('#aa0000').setRotation(0.8);

    this.input.on('gameobjectdown', function (pointer, gameObject) {

        //  Will contain the top-most Game Object (in the display list)
        this.tweens.add({
            targets: gameObject,
            x: { value: 1100, duration: 1500, ease: 'Power2' },
            y: { value: 500, duration: 500, ease: 'Bounce.easeOut', delay: 150 }
        });

    }, this);
}