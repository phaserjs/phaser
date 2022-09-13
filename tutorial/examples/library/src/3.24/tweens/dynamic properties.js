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
    var image = this.add.image(100, 300, 'ball');

    var destX = 700;

    var tween = this.tweens.add({
        targets: image,
        duration: 500,
        yoyo: true,
        repeat: 8,
        ease: 'Sine.easeInOut',

        x: {

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

    });
}
