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

var clockSize = 100;
var graphics;
var timerEvents = [];

var game = new Phaser.Game(config);

function create ()
{
    //  4 x 3
    for (var i = 0; i < 12; i++)
    {
        timerEvents.push(this.time.addEvent({ delay: 200 + (i * 400), loop: true }));
    }

    graphics = this.add.graphics({ x: 0, y: 0 });
}

function update ()
{
    graphics.clear();

    var x = clockSize;
    var y = clockSize;

    for (var i = 0; i < timerEvents.length; i++)
    {
        drawClock(x, y, timerEvents[i].getProgress());

        x += (clockSize * 2);

        if (x >= 800)
        {
            x = clockSize;
            y += (clockSize * 2);
        }
    }
}

function drawClock (x, y, progress)
{
    //  Progress is between 0 and 1, where 0 = the hand pointing up and then rotating clockwise a full 360

    var angle = (360 * progress) - 90;

    graphics.lineStyle(4, 0xffffff, 1);
    graphics.strokeCircle(x, y, clockSize * 0.95);

    graphics.lineStyle(2, 0xffff00, 1);

    var dest = Phaser.Math.RotateAroundDistance({ x: x, y: y }, x, y, Phaser.Math.DegToRad(angle), clockSize * 0.95);

    graphics.beginPath();

    graphics.moveTo(x, y);

    var p1 = Phaser.Math.RotateAroundDistance({ x: x, y: y }, x, y, Phaser.Math.DegToRad(angle - 5), clockSize * 0.7);

    graphics.lineTo(p1.x, p1.y);
    graphics.lineTo(dest.x, dest.y);

    graphics.moveTo(x, y);

    var p2 = Phaser.Math.RotateAroundDistance({ x: x, y: y }, x, y, Phaser.Math.DegToRad(angle + 5), clockSize * 0.7);

    graphics.lineTo(p2.x, p2.y);
    graphics.lineTo(dest.x, dest.y);

    graphics.strokePath();
    graphics.closePath();

}
