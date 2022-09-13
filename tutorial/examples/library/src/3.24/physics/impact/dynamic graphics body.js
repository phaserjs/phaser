var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'impact',
        impact: {
            gravity: 100,
            debug: true,
            maxVelocity: 500
        }
    },
    scene: {
        create: create
    }
};

var game = new Phaser.Game(config);

function create ()
{
    //  Calling this with no arguments will set the bounds to match the game config width/height
    this.impact.world.setBounds();

    //  Create a Graphics object
    var graphics = this.add.graphics();

    //  If you don't set the body as active it won't collide with the world bounds
    var star = this.impact.add.body(200, 200).setActiveCollision().setVelocity(300, 150).setBounce(1);

    //  Set a body size of 100x100
    star.setBodySize(100, 100);

    star.body.updateCallback = function (body)
    {
        graphics.clear();

        drawStar(graphics, body.pos.x + 50, body.pos.y + 50, 5, 64, 64 / 2, 0x0000ff, 0xffffff);
    };
}

function drawStar (graphics, cx, cy, spikes, outerRadius, innerRadius, color, lineColor)
{
    var rot = Math.PI / 2 * 3;
    var x = cx;
    var y = cy;
    var step = Math.PI / spikes;

    graphics.lineStyle(4, lineColor, 1);
    graphics.fillStyle(color, 1);
    graphics.beginPath();
    graphics.moveTo(cx, cy - outerRadius);

    for (i = 0; i < spikes; i++)
    {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        graphics.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        graphics.lineTo(x, y);
        rot += step;
    }

    graphics.lineTo(cx, cy - outerRadius);
    graphics.closePath();
    graphics.fillPath();
    graphics.strokePath();
}
