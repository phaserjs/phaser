var config = {
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    scene: {
        create: create,
        update: update
    },
    width: 800,
    height: 600
};

var game = new Phaser.Game(config);
var starGraphics;


function create() {
    starGraphics = this.add.graphics({x: 400, y: 300});
    drawStar(starGraphics, 0, 0,  5, 100, 50, 0xFFFF00, 0xFF0000);
}

function update() {
    starGraphics.rotation += 0.01;
    starGraphics.scaleX = 0.8 + Math.abs(Math.sin(starGraphics.rotation));
    starGraphics.scaleY = 0.8 + Math.abs(Math.sin(starGraphics.rotation));
}

function drawStar (graphics, cx, cy, spikes, outerRadius, innerRadius, color, lineColor) {
    var rot = Math.PI / 2 * 3;
    var x = cx;
    var y = cy;
    var step = Math.PI / spikes;
    graphics.lineStyle(10, lineColor, 1.0);
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
    graphics.fillPath();
    graphics.strokePath();
}
