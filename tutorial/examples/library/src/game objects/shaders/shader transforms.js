var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#0972ff',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.glsl('marble', 'assets/shaders/marble.glsl.js');
    this.load.image('bird', 'assets/pics/birdy.png');
}

function create ()
{
    this.add.image(400, 600, 'bird').setOrigin(0.5, 1);

    var shader = this.add.shader('marble', 400, 300, 800, 600);


    this.input.once('pointerdown', function () {

        this.tweens.add({
            targets: shader,
            props: {
                scaleX: { value: 0.2, duration: 4000 },
                scaleY: { value: 0.2, duration: 4000 },
                angle: { value: 360, duration: 2000 },
                y: { value: 100, duration: 1000 }
            },
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });

    }, this);
}
