var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        create: create
    },
};

var game = new Phaser.Game(config);

function create() {

    var graphics = this.add.graphics();

    drawStar(graphics, 100, 300, 4, 50, 50 / 2, 0xffff00, 0xff0000);
    drawStar(graphics, 400, 300, 5, 100, 100 / 2, 0xffff00, 0xff0000);
    drawStar(graphics, 700, 300, 6, 50, 50 / 2, 0xffff00, 0xff0000);
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
