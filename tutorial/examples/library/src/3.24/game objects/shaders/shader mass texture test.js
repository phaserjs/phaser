var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 1024,
    height: 768,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.glsl('bundle', 'assets/shaders/bundle.glsl.js');
}

function create ()
{
    var shader = this.add.shader('Colorful Voronoi', 0, 0, 128, 128);

    shader.setRenderToTexture('wibble');

    var blocks = this.add.group({ key: 'wibble', repeat: 63, setScale: { x: 0.5, y: 0.5 } });

    Phaser.Actions.GridAlign(blocks.getChildren(), {
        width: 9,
        height: 7,
        cellWidth: 128,
        cellHeight: 128,
        x: 0,
        y: 0
    });

    var i = 0;

    blocks.children.iterate(function (child) {

        this.tweens.add({
            targets: child,
            props: {
                scale: { value: 1, duration: 500 },
                angle: { value: 360, duration: 4000 }
            },
            ease: 'Sine.easeInOut',
            delay: i * 50,
            repeat: -1,
            yoyo: true
        });

        i++;

        if (i % 10 === 0)
        {
            //i = 0;
        }

    }, this);
}
