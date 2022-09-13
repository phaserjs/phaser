var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    scene: {
        create: create
        ,update: update
    }
};
var Point = function (x, y, time) {
    this.x = x;
    this.y = y;
    this.time = time;
};

var normalizeValue = function (value, min, max) {
    return (value - min) / (max - min);
};

var linearInterpolation = function (norm, min, max) {
    return (max - min) * norm + min;
};
var trail;
var points = [];
var head = {x: 0, y: 0};
var game = new Phaser.Game(config);

function create() {

    trail = this.add.graphics();

    this.input.on('pointermove', function (pointer) {

        head.x = pointer.x;
        head.y = pointer.y;

        points.push(new Point(head.x, head.y, 4.0));

    });
}

function update() {

    trail.clear();
    if (points.length > 4) {
        trail.lineStyle(1, 0xFFFF00, 1.0);
        trail.beginPath();
        trail.moveFxTo(points[0].x, points[0].y, 0, 0xFFFF00, 0);
        for (var index = 1; index < points.length - 4; ++index)
        {
            var point = points[index];
            trail.lineFxTo(
                point.x, point.y, 
                linearInterpolation(index / (points.length - 4), 0, 20),
                ((0xFF&0x0ff)<<16)|(((linearInterpolation(index / points.length, 0x00, 0xFF)|0)&0x0ff)<<8)|(00&0x0ff)
                
            );
        }
        var count = 0;
        for (var index = points.length - 4; index < points.length; ++index)
        {
            var point = points[index];
            trail.lineFxTo(
                point.x, point.y, 
                linearInterpolation(count++ / 4, 20, 0),
                ((0xFF&0x0ff)<<16)|(((linearInterpolation(index / points.length, 0x00, 0xFF)|0)&0x0ff)<<8)|(00&0x0ff)
            );
        }
        trail.strokePath();
        trail.closePath();
    }
    for (var index = 0; index < points.length; ++index)
    {
        var point = points[index];
       
        point.time -= 0.5;
        if (point.time <= 0)
        {
            points.splice(index, 1);
            index -= 1;
        }
    }
}

game.canvas.addEventListener('touchmove', function(event) {
    event.preventDefault();
    if (event.targetTouches.length == 1) {
        var touch = event.targetTouches[0];
        head.x = touch.pageX;
        head.y = touch.pageY;

        points.push(new Point(head.x, head.y, 4.0));
    }
}, false);