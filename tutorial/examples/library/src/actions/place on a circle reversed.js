class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('ball', 'assets/sprites/shinyball.png');
    }

    create ()
    {
        this.group1 = this.add.group({ key: 'ball', frameQuantity: 36 });
        this.group2 = this.add.group({ key: 'ball', frameQuantity: 32 });
        this.group3 = this.add.group({ key: 'ball', frameQuantity: 26 });
        this.group4 = this.add.group({ key: 'ball', frameQuantity: 16 });

        this.circle1 = new Phaser.Geom.Circle(400, 300, 200);
        this.circle2 = new Phaser.Geom.Circle(400, 300, 160);
        this.circle3 = new Phaser.Geom.Circle(400, 300, 120);
        this.circle4 = new Phaser.Geom.Circle(400, 300, 80);

        Phaser.Actions.PlaceOnCircle(this.group1.getChildren(), this.circle1);
        Phaser.Actions.PlaceOnCircle(this.group2.getChildren(), this.circle2);
        Phaser.Actions.PlaceOnCircle(this.group3.getChildren(), this.circle3);
        Phaser.Actions.PlaceOnCircle(this.group4.getChildren(), this.circle4);
    }

    update ()
    {
        Phaser.Actions.RotateAroundDistance(this.group1.getChildren(), this.circle1, -0.030, this.circle1.radius);
        Phaser.Actions.RotateAroundDistance(this.group2.getChildren(), this.circle2, 0.025, this.circle2.radius);
        Phaser.Actions.RotateAroundDistance(this.group3.getChildren(), this.circle3, -0.020, this.circle3.radius);
        Phaser.Actions.RotateAroundDistance(this.group4.getChildren(), this.circle4, 0.015, this.circle4.radius);
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: [ Example ]
};

const game = new Phaser.Game(config);
