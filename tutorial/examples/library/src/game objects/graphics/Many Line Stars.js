var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    scene: {
        create: create,
        update: update
    },
    batchSize: 8000,
    width: 800,
    height: 600
};

var stars = [];
var cameraRotation = 0;
var game = new Phaser.Game(config);

function create() {
    var radius = 10;
    var radius2 = radius * 2;
    var maxWidth = (800 / radius2)|0;

    for (var i = 0; i < 1200; ++i)
    {
        var graphics = this.add.graphics({x: radius + (i % maxWidth) * radius2, y: radius + ((i / maxWidth)|0) * radius2});
        drawStar(graphics, 0, 0, 5, radius, radius / 2, 0xff0000, 0xFFFF00);
        stars.push(graphics);
        stars[i].rotation += i * 0.01;
    }
}

function update ()
{
    for (var i = 0; i < stars.length; ++i)
    {
        var star = stars[i];
        star.rotation += 0.01;
        star.scaleX = 0.5 + Math.abs(Math.sin(star.rotation));
        star.scaleY = 0.5 + Math.abs(Math.sin(star.rotation));
    }
}

function drawStar (graphics, cx, cy, spikes, outerRadius, innerRadius, color, lineColor) {
    var rot = Math.PI / 2 * 3;
    var x = cx;
    var y = cy;
    var step = Math.PI / spikes;
    graphics.lineStyle(1, lineColor, 1.0);
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
