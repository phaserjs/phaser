var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('raster', 'assets/demoscene/rastercarpet32.png');
}

function create ()
{
    var sprite1 = this.add.sprite(0, 100, 'raster');
    var sprite2 = this.add.sprite(-100, 0, 'raster').setAngle(90);
    var sprite3 = this.add.sprite(0, -100, 'raster').setAngle(180);
    var sprite4 = this.add.sprite(100, 0, 'raster').setAngle(270);

    var containers = [];

    for (var i = 0; i < 128; i++)
    {
        var container = this.add.container(400, 300);

        if (i > 0)
        {
            container.setExclusive(false);
        }

        container.add([ sprite1, sprite2, sprite3, sprite4 ]);

        containers.push(container);
    }

    this.tweens.add({
        targets: sprite1,
        y: -200,
        ease: 'Sine.easeInOut',
        duration: 4000,
        repeat: -1,
        yoyo: true
    });

    this.tweens.add({
        targets: sprite2,
        x: 300,
        ease: 'Sine.easeInOut',
        duration: 4000,
        repeat: -1,
        yoyo: true
    });

    this.tweens.add({
        targets: sprite3,
        y: 200,
        ease: 'Sine.easeInOut',
        duration: 4000,
        repeat: -1,
        yoyo: true
    });

    this.tweens.add({
        targets: sprite4,
        x: -300,
        ease: 'Sine.easeInOut',
        duration: 4000,
        repeat: -1,
        yoyo: true
    });

    this.tweens.add({
        targets: containers,
        angle: { value: 360, duration: 6000 },
        scaleX: { value: 2, duration: 3000, yoyo: true, ease: 'Quad.easeInOut' },
        scaleY: { value: 4, duration: 3000, yoyo: true, ease: 'Cubic.easeInOut' },
        repeat: -1,
        delay: function (target, key, value, index, total, tween) {
            return index * 32;
        }
    });
}
