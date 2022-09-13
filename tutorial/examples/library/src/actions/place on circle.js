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
        const circle = new Phaser.Geom.Circle(400, 300, 260);
        this.group = this.add.group({ key: 'ball', frameQuantity: 32 });

        Phaser.Actions.PlaceOnCircle(this.group.getChildren(), circle);

        this.tween = this.tweens.addCounter({
            from: 260,
            to: 0,
            duration: 3000,
            delay: 2000,
            ease: 'Sine.easeInOut',
            repeat: -1,
            yoyo: true
        });
    }

    update ()
    {
        Phaser.Actions.RotateAroundDistance(this.group.getChildren(), { x: 400, y: 300 }, 0.02, this.tween.getValue());
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
