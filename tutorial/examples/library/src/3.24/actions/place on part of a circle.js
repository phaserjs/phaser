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

function preload ()
{
    this.load.image('ball', 'assets/sprites/shinyball.png');
}

function create ()
{
    group1 = this.add.group({ key: 'ball', frameQuantity: 16 });
    group2 = this.add.group({ key: 'ball', frameQuantity: 16 });
    group3 = this.add.group({ key: 'ball', frameQuantity: 16 });
    group4 = this.add.group({ key: 'ball', frameQuantity: 16 });

    Phaser.Actions.PlaceOnCircle(group1.getChildren(), { x: 400, y: 300, radius: 200 });
    Phaser.Actions.PlaceOnCircle(group2.getChildren(), { x: 400, y: 300, radius: 160 });
    Phaser.Actions.PlaceOnCircle(group3.getChildren(), { x: 400, y: 300, radius: 120 });
    Phaser.Actions.PlaceOnCircle(group4.getChildren(), { x: 400, y: 300, radius: 80 });
}

function update ()
{
    Phaser.Actions.RotateAroundDistance(group1.getChildren(), { x: 400, y: 300 }, 0.02, 200);
    Phaser.Actions.RotateAroundDistance(group2.getChildren(), { x: 400, y: 300 }, 0.02, 160);
    Phaser.Actions.RotateAroundDistance(group3.getChildren(), { x: 400, y: 300 }, 0.02, 120);
    Phaser.Actions.RotateAroundDistance(group4.getChildren(), { x: 400, y: 300 }, 0.02, 80);
}
