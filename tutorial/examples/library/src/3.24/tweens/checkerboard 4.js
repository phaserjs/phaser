var config = {
    type: Phaser.CANVAS,
    width: 800,
    height: 600,
    backgroundColor: '#080808',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('bg', 'assets/pics/skull-and-bones.jpg');
    this.load.image('block', 'assets/sprites/50x50-black.png');
}

function create ()
{
    this.add.image(400, 300, 'bg');

    var blocks = this.add.group({ key: 'block', repeat: 191 });

    Phaser.Actions.GridAlign(blocks.getChildren(), {
        width: 16,
        cellWidth: 50,
        cellHeight: 50,
        x: 25,
        y: 25
    });

    var _this = this;

    var i = 0;

    blocks.children.iterate(function (child) {

        _this.tweens.add({
            targets: child,
            scaleX: 0,
            scaleY: 0,
            alpha: 0,
            y: '+=64',
            angle: 180,
            ease: 'Power3',
            duration: 1000,
            delay: 1000 + (i * 100)
        });

        i++;

        //  Change the value 32 for different results
        if (i % 16 === 0)
        {
            i = 0;
        }

    });
}
