var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var curve;
var points;
var pathBounds;
var spriteBounds;
var boundsColor = 0x00ff00;
var intersects = false;
var left = -1;
var right = -1;
var graphics;
var text;
var hitLine = new Phaser.Geom.Line();

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('test', 'assets/sprites/32x32.png');
    // this.load.image('test', 'assets/sprites/arrow.png');
}

function create ()
{
    graphics = this.add.graphics();

    var image = this.add.sprite(200, 100, 'test').setAlpha(0.5).setInteractive();

    text = this.add.text(10, 10, '', { font: '16px Courier', fill: '#00ff00' });

    this.input.setDraggable(image);

    curve = new Phaser.Curves.Spline([
        50, 300,
        164, 246,
        274, 442,
        412, 157,
        522, 541,
        664, 264
    ]);

    points = curve.getDistancePoints(32);

    pathBounds = new Phaser.Geom.Rectangle();
    spriteBounds = new Phaser.Geom.Rectangle();

    curve.getBounds(pathBounds);
    image.getBounds(spriteBounds);

    this.input.on(Phaser.Input.Events.DRAG, function (event) {

        event.gameObject.x = event.dragX;
        event.gameObject.y = event.dragY;

        image.getBounds(spriteBounds);

        intersects = false;

        if (Phaser.Geom.Intersects.RectangleToRectangle(pathBounds, spriteBounds))
        {
            boundsColor = 0xff0000;

            //  Within the curve bounds, so let's check the points

            left = -1;
            right = -1;

            for (var i = 0; i < points.length; i++)
            {
                var p = points[i];

                if (p.x > spriteBounds.x)
                {
                    left = i - 1;

                    if (left < 0)
                    {
                        left = 0;
                    }

                    break;
                }
            }

            for (var i = points.length - 1; i >= left; i--)
            {
                var p = points[i];

                if (p.x < spriteBounds.right)
                {
                    right = i + 1;

                    if (right === points.length)
                    {
                        right--;
                    }

                    break;
                }
            }

            if (left == -1 && right !== -1)
            {
                left = 0;
            }
            else if (left !== -1 && right == -1)
            {
                right = points.length - 1;
            }

            //  Rect vs. Line intersection between left and right
            var temp = new Phaser.Geom.Line();

            for (var i = left; i < right; i++)
            {
                var p1 = points[i];
                var p2 = points[i + 1];

                if (!intersects && p1 && p2)
                {
                    temp.setTo(p1.x, p1.y, p2.x, p2.y);

                    if (Phaser.Geom.Intersects.LineToRectangle(temp, spriteBounds))
                    {
                        intersects = true;

                        Phaser.Geom.Line.CopyFrom(temp, hitLine);

                        break;
                    }
                }
            }
        }
        else
        {
            boundsColor = 0x00ff00;
            left = -1;
            right = -1;
        }

    });
}

function update ()
{
    text.setText([
        'left: ' + left,
        'right: ' + right
    ]);

    graphics.clear();

    //  Draw the bounds
    graphics.lineStyle(1, boundsColor, 1).strokeRectShape(pathBounds);

    if (left !== -1)
    {
        graphics.lineBetween(points[left].x, 0, points[left].x, 600);
        graphics.lineBetween(points[right].x, 0, points[right].x, 600);
    }

    graphics.lineStyle(1, boundsColor, 1).strokeRectShape(spriteBounds);

    graphics.lineStyle(1, 0xffffff, 0.5);

    curve.draw(graphics, 64);

    for (var i = 0; i < points.length; i++)
    {
        var p = points[i];

        if (i >= left && i <= right)
        {
            graphics.fillStyle(0xff00ff, 1);
            graphics.fillCircle(p.x, p.y, 3);
        }
        else
        {
            graphics.fillStyle(0x00ff00, 1);
            graphics.fillCircle(p.x, p.y, 2);
        }
    }

    if (intersects)
    {
        graphics.lineStyle(2, 0xffff00, 1);
        graphics.strokeLineShape(hitLine);
    }

}
