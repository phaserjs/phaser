class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
        this.i = 0;
    }

    preload ()
    {
        this.load.spritesheet('balls', 'assets/sprites/balls.png', { frameWidth: 17, frameHeight: 17 });
    }

    create ()
    {
        this.rect = new Phaser.Geom.Rectangle(64, 32, 100, 512);

        this.group = this.add.group({ key: 'balls', frame: [0,1,2,3,4,5], frameQuantity: 10 });
        this.tweens.add({
            targets: this.rect,
            x: 200,
            y: 200,
            width: 512,
            height: 100,
            delay: 2000,
            duration: 3000,
            ease: 'Sine.easeInOut',
            repeat: -1,
            yoyo: true
        });
    }

    update ()
    {
        Phaser.Actions.PlaceOnRectangle(this.group.getChildren(), this.rect, this.i);

        this.i++;
        if (this.i === this.group.length)
        {
            this.i = 0;
        }
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: [ Example ]
};

const game = new Phaser.Game(config);
