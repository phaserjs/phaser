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
        this.ellipse = new Phaser.Geom.Ellipse(400, 300, 200, 500);
        this.group = this.add.group({ key: 'ball', frameQuantity: 48 });
        Phaser.Actions.PlaceOnEllipse(this.group.getChildren(), this.ellipse);

        this.tweens.add({
            targets: this.ellipse,
            width: 700,
            height: 100,
            delay: 1000,
            duration: 2000,
            ease: 'Sine.easeInOut',
            repeat: -1,
            yoyo: true
        });
    }

    update ()
    {
        Phaser.Actions.PlaceOnEllipse(this.group.getChildren(), this.ellipse);
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
