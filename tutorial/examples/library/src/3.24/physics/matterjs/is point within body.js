var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#4d4d4d',
    parent: 'phaser-example',
    physics: {
        default: 'matter',
        matter: {
            enableSleeping: false,
            gravity: {
                y: 0
            },
            debug: {}
        }
    },
    scene: {
        create: create
    }
};

var game = new Phaser.Game(config);

function create ()
{
    var body1 = this.matter.add.polygon(100, 300, 8, 70, { isStatic: true });
    var body2 = this.matter.add.fromVertices(300, 300, '50 0 63 38 100 38 69 59 82 100 50 75 18 100 31 59 0 38 37 38', {}, true);
    var body3 = this.matter.add.polygon(500, 300, 3, 60);
    var body4 = this.matter.add.rectangle(700, 300, 48, 256);

    var fillOver = 0xff0000;
    var strokeOver = 0xffff00;
    var lineThicknessOver = 4;

    var bodies = [ body1, body2, body3, body4 ];

    this.input.on('pointermove', function (pointer) {

        var x = pointer.worldX;
        var y = pointer.worldY;

        for (var i = 0; i < bodies.length; i++)
        {
            var body = bodies[i];

            if (this.matter.containsPoint(body, x, y))
            {
                this.matter.setBodyRenderStyle(body, fillOver, strokeOver, lineThicknessOver);
            }
            else
            {
                this.matter.setBodyRenderStyle(body);
            }
        }

    }, this);
}
