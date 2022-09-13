var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    scene: {
        create: create,
        update: update
    },
    width: 800,
    height: 600
};
var starGraphics;
var stars = [];
var game = new Phaser.Game(config);


function create() {
    var colorsTable = [
        0xFF0000,
        0x00FF00,
        0x0000FF,
        0xFF00FF,
        0xFFFF00,
        0x00FFFF
    ];
    for (var i = 0; i < 500; ++i)
    {
        starGraphics = this.add.graphics({x: Math.random() * 800, y:Math.random() * 600});
        drawStar(starGraphics, 0, 0,  5, 100, 50, colorsTable[Math.floor(Math.random() * 6)], 0xFF0000);
        starGraphics.fillRect(100, 100, 100, 100);
        starGraphics.rotation = Math.random();
        starGraphics.scaleX = 0.1 + Math.abs(Math.sin(starGraphics.rotation)) * 0.2;
        starGraphics.scaleY = 0.1 + Math.abs(Math.sin(starGraphics.rotation)) * 0.2;
        stars.push(starGraphics);
    }
}

function update() {
    for (var i = 0; i < stars.length; ++i)
    {
        var star = stars[i];
        star.rotation += 0.01;
        star.scaleX = 0.1 + Math.abs(Math.sin(starGraphics.rotation)) * 0.2;
        star.scaleY = 0.1 + Math.abs(Math.sin(starGraphics.rotation)) * 0.2;
    }
}

function drawStar (
    graphics, 
    cx, cy, 
    spikes, 
    outerRadius, innerRadius, 
    color, lineColor) {
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
    //graphics.strokePath();
    graphics.fillPath();
}
