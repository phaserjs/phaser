var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        create: create,
        update: update
    }
};

var rt;
var graphics;

var game = new Phaser.Game(config);

function create ()
{
    graphics = this.add.graphics();
    graphics.setVisible(false);

    drawStar(graphics, 200, 200,  5, 200, 100, 0xffff00);

    rt = this.add.renderTexture(400, 300, 400, 400).setOrigin(0.5);
}

function update ()
{
    rt.camera.rotation -= 0.01;

    rt.clear();

    rt.draw(graphics);
}

function drawStar (graphics, cx, cy, spikes, outerRadius, innerRadius, color)
{
    var rot = Math.PI / 2 * 3;
    var x = cx;
    var y = cy;
    var step = Math.PI / spikes;

    graphics.fillStyle(color, 1.0);
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
}
