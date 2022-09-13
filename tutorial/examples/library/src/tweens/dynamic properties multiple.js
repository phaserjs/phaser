var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('ball', 'assets/sprites/shinyball.png');
}

function create ()
{
    var image = this.add.image(100, 100, 'ball');

    var destX = 700;

    //  TODO: Cache the start and end values so that on a Tween LOOP (not a TweenData repeat) it can reset them :)

    var tween = this.tweens.add({

        targets: image,

        props: {

            y: {
                value: 500,
                duration: 8000,
                ease: 'Power1'
            },

            x: {
                duration: 400,
                yoyo: true,
                repeat: 8,
                ease: 'Sine.easeInOut',
                value: {

                    getEnd: function (target, key, value)
                    {
                        destX -= 30;

                        return destX;
                    },

                    getStart: function (target, key, value)
                    {
                        return value + 30;
                    }

                }
            }

        }

    });
}
