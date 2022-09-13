var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    parent: 'phaser-example',
    physics: {
        default: 'matter',
        matter: {
            gravity: {
                y: 0.02
            },
            enableSleep: true,
            debug: true
        }
    },
    scene: {
        create: create
    }
};

var game = new Phaser.Game(config);

function create ()
{
    this.matter.world.setBounds();

    var triSize = 8;
    var lastPosition = new Phaser.Math.Vector2();
    var options = { friction: 0.005, frictionAir: 0, restitution: 1 };

    this.input.on('pointerdown', function (pointer) {

        lastPosition.x = pointer.x;
        lastPosition.y = pointer.y;

        this.matter.add.polygon(pointer.x, pointer.y, 3, triSize, options);

    }, this);

    this.input.on('pointermove', function (pointer) {

        if (pointer.isDown)
        {
            var x = pointer.x;
            var y = pointer.y;

            if (Phaser.Math.Distance.Between(x, y, lastPosition.x, lastPosition.y) > triSize * 1.5)
            {
                lastPosition.x = x;
                lastPosition.y = y;

                this.matter.add.polygon(pointer.x, pointer.y, 3, triSize, options);
            }
        }

    }, this);
}
