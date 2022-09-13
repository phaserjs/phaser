var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var vx = 0;
var vy = 0;
var face = Phaser.Physics.Arcade.FACING_NONE;
var faceX = Phaser.Physics.Arcade.FACING_NONE;
var faceY = Phaser.Physics.Arcade.FACING_NONE;
var timeXCollision = 0;
var timeYCollision = 0;
var text;
var body1;
var body2;
var prev;
var graphics;
var moveTween;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('bg', 'assets/tests/32pxstrip.png');
}

function draw ()
{
    var x = (body2.x + (body2.width / 2));
    var y = (body2.y + (body2.height / 2));

    var embedded = false;
    var embeddedX = false;
    var embeddedY = false;

    graphics.clear();

    graphics.lineStyle(2, 0xff00ff);
    graphics.lineBetween(x, y, x + vx / 2, y + vy / 2);

    graphics.lineStyle(2, 0xffffff);
    graphics.strokeRectShape(body1);

    var intersects = Phaser.Physics.Arcade.IntersectsRect(body1, body2);

    if (intersects)
    {
        var distanceX1 = body1.right - body2.x;
        var distanceX2 = body2.right - body1.x;
    
        var distanceY1 = body1.bottom - body2.y;
        var distanceY2 = body2.bottom - body1.y;
   
        var leftFace = (distanceX1 > distanceX2);
        var topFace = (distanceY1 > distanceY2);

        var touchingX = false;
        var intersectsX = true;
        var intersectsY = true;

        if (body1.x === body2.right)
        {
            leftFace = true;
            touchingX = true;
            intersectsY = false;
        }
        else if (body1.right === body2.x)
        {
            leftFace = false;
            touchingX = true;
            intersectsY = false;
        }

        if (body1.y === body2.bottom)
        {
            topFace = true;
            intersectsX = false;
        }
        else if (body1.bottom === body2.y)
        {
            topFace = false;
            intersectsX = false;
        }

        var overlapX = 0;
        var overlapY = 0;

        faceX = Phaser.Physics.Arcade.FACING_NONE;
        faceY = Phaser.Physics.Arcade.FACING_NONE;

        var dx = vx;
        var dy = vy;

        if (dx === 0)
        {
            dx = 1;
        }

        if (dy === 0)
        {
            dy = 1;
        }

        if (leftFace && intersectsX)
        {
            overlapX = distanceX2;
            faceX = Phaser.Physics.Arcade.FACING_LEFT;
            timeXCollision = overlapX / ((vx === 0) ? 1 : -vx);
            // timeXCollision = overlapX / -dx;
        }
        else if (intersectsX)
        {
            overlapX = distanceX1;
            faceX = Phaser.Physics.Arcade.FACING_RIGHT;
            timeXCollision = overlapX / ((vx === 0) ? 1 : vx);
            // timeXCollision = overlapX / dx;
        }

        if (topFace && intersectsY)
        {
            overlapY = distanceY2;
            faceY = Phaser.Physics.Arcade.FACING_UP;
            timeYCollision = overlapY / ((vy === 0) ? 1 : vy);
            // timeYCollision = overlapY / dy;
        }
        else if (intersectsY)
        {
            overlapY = distanceY1;
            faceY = Phaser.Physics.Arcade.FACING_DOWN;
            timeYCollision = overlapY / ((vy === 0) ? 1 : -vy);
            // timeYCollision = overlapY / -dy;
        }

        var faces = { 10: 'None', 11: 'Up', 12: 'Down', 13: 'Left', 14: 'Right' };

        var forceX = (touchingX || (timeXCollision < timeYCollision));

        face = (forceX) ? faceX : faceY;

        console.log('forceX', forceX, 'time x', timeXCollision, 'time y', timeYCollision, '===', faces[face]);
        console.log('ox', overlapX, 'oy', overlapY);
        console.log('vx', vx, 'vy', vy);

        graphics.lineStyle(2, 0x0000ff);

        switch (faceX)
        {
            case Phaser.Physics.Arcade.FACING_LEFT:
                graphics.lineBetween(body1.x, body1.y, body1.x, body1.bottom);
                break;

            case Phaser.Physics.Arcade.FACING_RIGHT:
                graphics.lineBetween(body1.right, body1.y, body1.right, body1.bottom);
                break;

            case Phaser.Physics.Arcade.FACING_UP:
                graphics.lineBetween(body1.x, body1.y, body1.right, body1.y);
                break;

            case Phaser.Physics.Arcade.FACING_DOWN:
                graphics.lineBetween(body1.x, body1.bottom, body1.right, body1.bottom);
                break;
        }

        switch (faceY)
        {
            case Phaser.Physics.Arcade.FACING_LEFT:
                graphics.lineBetween(body1.x, body1.y, body1.x, body1.bottom);
                break;

            case Phaser.Physics.Arcade.FACING_RIGHT:
                graphics.lineBetween(body1.right, body1.y, body1.right, body1.bottom);
                break;

            case Phaser.Physics.Arcade.FACING_UP:
                graphics.lineBetween(body1.x, body1.y, body1.right, body1.y);
                break;

            case Phaser.Physics.Arcade.FACING_DOWN:
                graphics.lineBetween(body1.x, body1.bottom, body1.right, body1.bottom);
                break;
        }

        graphics.lineStyle(2, 0xff0000);

        switch (face)
        {
            case Phaser.Physics.Arcade.FACING_LEFT:
                graphics.lineBetween(body1.x - 4, body1.y, body1.x - 4, body1.bottom);
                break;

            case Phaser.Physics.Arcade.FACING_RIGHT:
                graphics.lineBetween(body1.right + 4, body1.y, body1.right + 4, body1.bottom);
                break;

            case Phaser.Physics.Arcade.FACING_UP:
                graphics.lineBetween(body1.x, body1.y - 4, body1.right, body1.y - 4);
                break;

            case Phaser.Physics.Arcade.FACING_DOWN:
                graphics.lineBetween(body1.x, body1.bottom + 4, body1.right, body1.bottom + 4);
                break;
        }

        var maxOverlapX = 16;
        var maxOverlapY = 16;

        embeddedX = (forceX && overlapX > maxOverlapX);
        embeddedY = (!forceX && overlapY > maxOverlapY);
        
        embedded = (embeddedX || embeddedY);
    }

    if (embeddedX)
    {
        graphics.lineStyle(2, 0xff0000);
    }
    else if (embeddedY)
    {
        graphics.lineStyle(2, 0xff00ff);
    }
    else
    {
        graphics.lineStyle(2, 0xffff00);
    }

    graphics.strokeRectShape(body2);

    return intersects;
}

function create ()
{
    this.add.image(0, 0, 'bg').setOrigin(0);

    body1 = new Phaser.Geom.Rectangle(300, 200, 200, 256);

    body2 = new Phaser.Geom.Rectangle(0, 0, 256, 16);

    //  Top
    // body2 = new Phaser.Geom.Rectangle(300 - 60, 10, 64, 48);
    // var destX = body2.x;
    // var destY = 500;

    //  Bottom
    // body2 = new Phaser.Geom.Rectangle(300 - 60, 550, 64, 48);
    // var destX = body2.x;
    // var destY = 0;

    //  Left
    // body2 = new Phaser.Geom.Rectangle(20, 200 - 44, 64, 48);
    // var destX = 700;
    // var destY = body2.y;

    //  Right
    // body2 = new Phaser.Geom.Rectangle(750, 200 - 44, 64, 48);
    // var destX = 0;
    // var destY = body2.y;

    //  Right Bottom
    // body2 = new Phaser.Geom.Rectangle(750, body1.bottom - 4, 64, 48);
    // var destX = 0;
    // var destY = body2.y;

    prev = new Phaser.Math.Vector2(body2.x, body2.y);

    graphics = this.add.graphics();

    /*
    moveTween = this.tweens.add({
        targets: body2,
        x: destX,
        y: destY,
        duration: 100,
        ease: 'Linear',
        delay: 1000
    });
    */

    text = this.add.text(10, 10, '', { font: '16px Courier', fill: '#000000' });

    this.input.on('pointermove', function (p) {

        body2.x = p.x;
        body2.y = p.y;

    }, this);
}

function update ()
{
    vx = (body2.x - prev.x);
    vy = (body2.y - prev.y);

    text.setText([
        vx,
        vy,
        timeXCollision,
        timeYCollision
    ]);

    draw();

    //  Displacement Test:

    /*
    if (face === Phaser.Physics.Arcade.FACING_NONE)
    {
        draw();

        if (face !== Phaser.Physics.Arcade.FACING_NONE)
        {
            text.setText([
                vx,
                vy
            ]);

            console.log(vx);
            console.log(vy);
            console.log(face);
            console.log(timeXCollision);
            console.log(timeYCollision);

            moveTween.stop();
        }
    }
    */

    prev.set(body2.x, body2.y);
}
