class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.spritesheet('diamonds', 'assets/sprites/diamonds32x24x5.png', { frameWidth: 32, frameHeight: 24 });
    }

    create ()
    {
        this.group = this.add.group();

        for (var i = 0; i < 256; i++)
        {
            this.group.create(Phaser.Math.Between(200, 600), Phaser.Math.Between(100, 500), 'diamonds', Phaser.Math.Between(0, 4));
        }

        this.geomPoint = new Phaser.Geom.Point(400, 300);

        this.input.on('pointermove', function (pointer) {
            this.geomPoint.setTo(pointer.x, pointer.y);
        }, this);
    }

    update ()
    {
        Phaser.Actions.RotateAroundDistance(this.group.getChildren(), this.geomPoint, 0.1, 100);
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: [ Example ]
};

const game = new Phaser.Game(config);
