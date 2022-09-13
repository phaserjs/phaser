class Scene extends Phaser.Scene
{
    constructor()
    {
        super();
    }

    preload()
    {
        this.load.image("cloud", "assets/bugs/cloud.png");
        this.load.image("mask", "assets/bugs/mask.png");
    }

    create()
    {
        this.cameras.main.setBackgroundColor(0xA9D4C9);

        this.add.image(400, 280, "cloud");

        const cloud2 = this.add.image(400, 300 + 100, "cloud");

        const mask = this.make.image({
            x: 400,
            y: 500,
            key: 'mask',
            add: false
        });

        cloud2.mask = new Phaser.Display.Masks.BitmapMask(this, mask);

        cloud2.mask.invertAlpha = true;
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: Scene
}

new Phaser.Game(config);
