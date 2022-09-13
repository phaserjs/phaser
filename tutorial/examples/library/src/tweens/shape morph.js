var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    backgroundColor: '#080808',
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('ball', 'assets/sprites/blue_ball.png');
}

function create ()
{
    var balls = this.add.group({ key: 'ball', repeat: 59 });

    var circle = new Phaser.Geom.Circle(400, 300, 160);
    var triangle = new Phaser.Geom.Triangle.BuildRight(200, 400, 300, 200);
    var rect = new Phaser.Geom.Rectangle(200, 150, 400, 300);
    var ellipse = new Phaser.Geom.Ellipse(400, 300, 200, 500);
    var triangle2 = new Phaser.Geom.Triangle.BuildEquilateral(400, 200, 300);

    //  Store the position data for each shape:
    Phaser.Actions.PlaceOnCircle(balls.getChildren(), circle);

    balls.children.iterate(function (child) {

        child.setData('circle', { x: child.x, y: child.y });

    });

    Phaser.Actions.PlaceOnTriangle(balls.getChildren(), triangle);

    balls.children.iterate(function (child) {

        child.setData('triangle', { x: child.x, y: child.y });

    });

    Phaser.Actions.PlaceOnRectangle(balls.getChildren(), rect);

    balls.children.iterate(function (child) {

        child.setData('rect', { x: child.x, y: child.y });

    });

    Phaser.Actions.PlaceOnEllipse(balls.getChildren(), ellipse);

    balls.children.iterate(function (child) {

        child.setData('ellipse', { x: child.x, y: child.y });

    });

    Phaser.Actions.PlaceOnTriangle(balls.getChildren(), triangle2);

    balls.children.iterate(function (child) {

        child.setData('triangle2', { x: child.x, y: child.y });

    });

    //  Start off on the Circle
    Phaser.Actions.PlaceOnCircle(balls.getChildren(), circle);

    var shapes = [ 'circle', 'triangle', 'rect', 'ellipse', 'triangle2' ];
    var shape1 = 0;
    var shape2 = 1;

    this.tweens.add({

        targets: balls.getChildren(),
        ease: 'Quintic.easeInOut',
        duration: 3000,
        delay: 1000,
        hold: 1000,
        loop: -1,

        x: {

            getEnd: function (target, key, value)
            {
                return target.getData(shapes[shape2]).x;
            },

            getStart: function (target, key, value)
            {
                return target.getData(shapes[shape1]).x;
            }

        },

        y: {

            getEnd: function (target, key, value)
            {
                return target.getData(shapes[shape2]).y;
            },

            getStart: function (target, key, value)
            {
                return target.getData(shapes[shape1]).y;
            }

        },

        onLoop: function ()
        {
            shape1 = Phaser.Math.Wrap(shape1 + 1, 0, 5);
            shape2 = Phaser.Math.Wrap(shape2 + 1, 0, 5);
        }

    });
}
