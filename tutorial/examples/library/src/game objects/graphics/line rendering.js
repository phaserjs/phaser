var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    backgroundColor: '#2d2d66',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var starGraphics;
var lineRectangle;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('pic', 'assets/sprites/phaser2.png');
}

function create() {

    this.add.image(400, 300, 'pic');

    starGraphics = this.add.graphics({x: 400, y: 300});
    drawStar(starGraphics, 0, 0, 5, 200, 100, 0xFFFF00, 0xFF0000);
    starGraphics.rotation = Math.random();
    lineRectangle = this.add.graphics({x: 400, y: 300});
    lineRectangle.lineStyle(5, 0x0000FF, 1.0);
    lineRectangle.fillStyle(0x0000FF, 1.0);
    lineRectangle.strokeRect(-100, -100, 200, 200);
}

function update() {
    lineRectangle.rotation += 0.01;
    starGraphics.rotation -= 0.01;
    starGraphics.scaleX = 0.8 + Math.abs(Math.sin(starGraphics.rotation));
    starGraphics.scaleY = 0.8 + Math.abs(Math.sin(starGraphics.rotation));
}

function drawStar (graphics, cx, cy, spikes, outerRadius, innerRadius, color, lineColor) {
    var rot = Math.PI / 2 * 3;
    var x = cx;
    var y = cy;
    var step = Math.PI / spikes;
    graphics.lineStyle(5, lineColor, 1.0);
    graphics.fillStyle(color, 1.0);
    graphics.beginPath();
    graphics.moveTo(cx, cy - outerRadius);
    for (i = 0; i < spikes; i++) {
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
    graphics.strokePath();
    graphics.fillPath();
}
