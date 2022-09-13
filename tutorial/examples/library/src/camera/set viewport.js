class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
        this.iter = 0;
    }

    preload ()
    {
        this.load.image('einstein', 'assets/pics/ra-einstein.png');
    }

    create ()
    {
        this.image = this.add.image(0, 0, 'einstein');
        this.cameras.main.setViewport(200, 150, 400, 300);
    }

    update ()
    {
        this.image.x = Math.sin(this.iter) * 200;
        this.image.y = Math.cos(this.iter) * 200;
        this.iter += 0.04;
    }
}

const config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: [ Example ],
};
const game = new Phaser.Game(config);
