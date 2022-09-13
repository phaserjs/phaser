var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        create: create,
        update: update
    },
};

var stars = [];
var cameraRotation = 0;
var camera0, camera1, camera2, camera3;

var game = new Phaser.Game(config);

function create() {

    var radius = 20;
    var radius2 = radius * 2;
    var maxWidth = (400 / radius2)|0;

    for (var i = 0; i < 80; ++i)
    {
        var graphics = this.add.graphics({x: radius + (i % maxWidth) * radius2, y: radius + ((i / maxWidth)|0) * radius2});
        drawStar(graphics, 0, 0, 5, radius, radius / 2, 0xff0000, 0xFFFF00);
        graphics.fillStyle(0xFFFF00 + (i % 0xFF), 1.0);
        stars.push(graphics);
        stars[i].rotation += 0.1;
    }

    this.cameras.main.setSize(400, 300);

    camera0 = this.cameras.main;
    camera1 = this.cameras.add(400, 0, 400, 300);
    camera2 = this.cameras.add(0, 300, 400, 300);
    camera3 = this.cameras.add(400, 300, 400, 300);
}

function update() {
    camera0.scrollX = Math.cos(cameraRotation) * 100;
    camera0.scrollY = Math.sin(cameraRotation) * 100;
    camera1.shake(100, 0.01);
    camera2.flash(2000);
    camera3.fade(2000);
    camera3.rotation = Math.sin(cameraRotation);
    camera3.zoom = 0.5 + Math.abs(Math.sin(cameraRotation));
    if (camera3._fadeAlpha >= 1.0)
    {
        camera3._fadeAlpha = 0.0;
        camera3.fade(1000);
    }
    for (var i = 0; i < stars.length; ++i)
    {
        var star = stars[i];
        star.rotation += 0.01;
        star.scaleX = 0.5 + Math.abs(Math.sin(star.rotation));
        star.scaleY = 0.5 + Math.abs(Math.sin(star.rotation));
    }
    cameraRotation += 0.01;
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
