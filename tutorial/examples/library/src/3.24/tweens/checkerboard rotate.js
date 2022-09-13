var config = {
    type: Phaser.WEBGL,
    width: 768,
    height: 576,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('block', 'assets/sprites/checkerboard.png');
}

function create ()
{
    var blocks = this.add.group({ key: 'block', repeat: 107 });

    Phaser.Actions.GridAlign(blocks.getChildren(), {
        width: 12,
        height: 9,
        cellWidth: 64,
        cellHeight: 64,
        x: 32,
        y: 32
    });

    var a = [ 0, 90, 180, 270 ];

    blocks.children.iterate(function (child) {

        child.angle = Phaser.Math.RND.pick(a);

        this.tweens.add({
            targets: child,
            ease: 'Power1',
            duration: 250,
            delay: (Math.random() * 6000),
            repeatDelay: 3000 + (Math.random() * 6000),
            repeat: -1,
            angle: {

                getEnd: function (target, key, value)
                {
                    var a = 90;

                    if (Math.random() > 0.5)
                    {
                        a = 180;
                    }

                    if (Math.random() > 0.5)
                    {
                        return target.angle + a;
                    }
                    else
                    {
                        return target.angle - a;
                    }
                },

                getStart: function (target, key, value)
                {
                    return target.angle;
                }

            }
        });

    }, this);

}
