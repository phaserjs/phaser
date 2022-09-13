var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: {
        create: create,
        update: update
    }
};

var graphics;
var timerEvent1;
var timerEvent2;
var timerEvent3;
var clockSize = 100;

var game = new Phaser.Game(config);

function create ()
{
    //  All 3 Timers are set for 5 seconds
    //  However the timeScale property scales the delay,
    //  causing the first timer to run for 10 seconds (half speed),
    //  and the 3rd to run for 2.5 seconds (twice speed)

    timerEvent1 = this.time.addEvent({ delay: 5000, timeScale: 0.5 });
    timerEvent2 = this.time.addEvent({ delay: 5000, timeScale: 1.0 });
    timerEvent3 = this.time.addEvent({ delay: 5000, timeScale: 2.0 });

    graphics = this.add.graphics({ x: 0, y: 0 });
}

function update ()
{
    graphics.clear();

    drawClock(150, 300, timerEvent1);
    drawClock(400, 300, timerEvent2);
    drawClock(650, 300, timerEvent3);
}

function drawClock (x, y, timer)
{
    //  Progress is between 0 and 1, where 0 = the hand pointing up and then rotating clockwise a full 360

    //  The frame
    graphics.lineStyle(3, 0xffffff, 1);
    graphics.strokeCircle(x, y, clockSize);

    var angle;
    var dest;
    var p1;
    var p2;
    var size;

    //  The overall progress hand (only if repeat > 0)
    if (timer.repeat > 0)
    {
        size = clockSize * 0.9;

        angle = (360 * timer.getOverallProgress()) - 90;
        dest = Phaser.Math.RotateAroundDistance({ x: x, y: y }, x, y, Phaser.Math.DegToRad(angle), size);

        graphics.lineStyle(2, 0xff0000, 1);

        graphics.beginPath();

        graphics.moveTo(x, y);

        p1 = Phaser.Math.RotateAroundDistance({ x: x, y: y }, x, y, Phaser.Math.DegToRad(angle - 5), size * 0.7);

        graphics.lineTo(p1.x, p1.y);
        graphics.lineTo(dest.x, dest.y);

        graphics.moveTo(x, y);

        p2 = Phaser.Math.RotateAroundDistance({ x: x, y: y }, x, y, Phaser.Math.DegToRad(angle + 5), size * 0.7);

        graphics.lineTo(p2.x, p2.y);
        graphics.lineTo(dest.x, dest.y);

        graphics.strokePath();
        graphics.closePath();
    }

    //  The current iteration hand
    size = clockSize * 0.95;

    angle = (360 * timer.getProgress()) - 90;
    dest = Phaser.Math.RotateAroundDistance({ x: x, y: y }, x, y, Phaser.Math.DegToRad(angle), size);

    graphics.lineStyle(2, 0xffff00, 1);

    graphics.beginPath();

    graphics.moveTo(x, y);

    p1 = Phaser.Math.RotateAroundDistance({ x: x, y: y }, x, y, Phaser.Math.DegToRad(angle - 5), size * 0.7);

    graphics.lineTo(p1.x, p1.y);
    graphics.lineTo(dest.x, dest.y);

    graphics.moveTo(x, y);

    p2 = Phaser.Math.RotateAroundDistance({ x: x, y: y }, x, y, Phaser.Math.DegToRad(angle + 5), size * 0.7);

    graphics.lineTo(p2.x, p2.y);
    graphics.lineTo(dest.x, dest.y);

    graphics.strokePath();
    graphics.closePath();
}
