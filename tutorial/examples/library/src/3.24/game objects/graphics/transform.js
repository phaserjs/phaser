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

var graphics;
var t = 0;
var rectangles = [];
var game = new Phaser.Game(config);

function create() {
    graphics = this.add.graphics({x: 0, y: 0});

    for (var i = 0; i < 100; ++i)
    {
        rectangles.push({
            x: Math.random() * 800,
            y: Math.random() * 600,
            w: 50 + Math.random() * 50,
            h: 50 + Math.random() * 50,
            r: Math.random()
        });
    }
    
}

function update() {

    graphics.clear();
    
    for (var i = 0; i < rectangles.length; ++i)
    {
        var rect = rectangles[i];
        graphics.save();
        graphics.translate(rect.x, rect.y);
        graphics.scale(Math.sin(rect.r), Math.sin(rect.r));
        graphics.rotate(rect.r);
        graphics.fillStyle(0xFFFF00, 1.0);
        graphics.lineStyle(4.0, 0xFF0000, 1.0);
        graphics.fillRect(-rect.w / 2, -rect.h / 2, rect.w, rect.h);
        graphics.strokeRect(-rect.w / 2, -rect.h / 2, rect.w, rect.h);
        graphics.restore();
        rect.r += 0.01;

    }
}

