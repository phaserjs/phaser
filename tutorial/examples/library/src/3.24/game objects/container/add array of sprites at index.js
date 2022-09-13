var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#662d91',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('rick', 'assets/sprites/rick.png');
}

function create ()
{
    //  Our container
    var container = this.add.container(400, 300);

    //  Create some sprites - positions are relative to the Container x/y
    var sprite0 = this.add.sprite(-200, 0, 'rick');
    var sprite1 = this.add.sprite(0, 0, 'rick');
    var sprite2 = this.add.sprite(200, 0, 'rick');
    var sprite3 = this.add.sprite(-100, -100, 'rick');
    var sprite4 = this.add.sprite(100, -100, 'rick');
    var sprite5 = this.add.sprite(100, 100, 'rick');

    container.add([ sprite0, sprite1, sprite2 ]);

    container.addAt([ sprite3, sprite4, sprite5 ], 0);

    this.tweens.add({
        targets: container,
        angle: { value: 360, duration: 6000 },
        scaleX: { value: 0.5, duration: 3000, yoyo: true, ease: 'Quad.easeInOut' },
        scaleY: { value: 0.5, duration: 3000, yoyo: true, ease: 'Quad.easeInOut' },
        repeat: -1
    });
}
