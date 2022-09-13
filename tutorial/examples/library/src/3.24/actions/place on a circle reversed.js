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

var game = new Phaser.Game(config);

var group1;
var group2;
var group3;
var group4;

var circle1;
var circle2;
var circle3;
var circle4;

function preload ()
{
    this.load.image('ball', 'assets/sprites/shinyball.png');
}

function create ()
{
    group1 = this.add.group({ key: 'ball', frameQuantity: 36 });
    group2 = this.add.group({ key: 'ball', frameQuantity: 32 });
    group3 = this.add.group({ key: 'ball', frameQuantity: 26 });
    group4 = this.add.group({ key: 'ball', frameQuantity: 16 });

    circle1 = new Phaser.Geom.Circle(400, 300, 200);
    circle2 = new Phaser.Geom.Circle(400, 300, 160);
    circle3 = new Phaser.Geom.Circle(400, 300, 120);
    circle4 = new Phaser.Geom.Circle(400, 300, 80);

    Phaser.Actions.PlaceOnCircle(group1.getChildren(), circle1);
    Phaser.Actions.PlaceOnCircle(group2.getChildren(), circle2);
    Phaser.Actions.PlaceOnCircle(group3.getChildren(), circle3);
    Phaser.Actions.PlaceOnCircle(group4.getChildren(), circle4);
}

function update ()
{
    Phaser.Actions.RotateAroundDistance(group1.getChildren(), circle1, -0.030, circle1.radius);
    Phaser.Actions.RotateAroundDistance(group2.getChildren(), circle2, 0.025, circle2.radius);
    Phaser.Actions.RotateAroundDistance(group3.getChildren(), circle3, -0.020, circle3.radius);
    Phaser.Actions.RotateAroundDistance(group4.getChildren(), circle4, 0.015, circle4.radius);
}
