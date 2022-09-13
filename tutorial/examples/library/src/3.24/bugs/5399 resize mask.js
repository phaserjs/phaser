class Demo extends Phaser.Scene
{
    constructor ()
    {
        super('demo');
    }

    preload ()
    {
        this.load.image('logo', 'https://raw.githubusercontent.com/photonstorm/phaser3-typescript-project-template/master/dist/assets/phaser3-logo.png');
        this.load.image('libs', 'https://raw.githubusercontent.com/photonstorm/phaser3-typescript-project-template/master/dist/assets/libs.png');
        this.load.image('mask', 'https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/sprites/mask1.png');
    }

    create ()
    {
        const libImage = this.add.image(400, 300, 'libs');

        const logo = this.add.image(400, 300, 'logo');

        let maskSprite = this.make.sprite({ x: 400, y: 300, key: 'mask', add: false });
        let bitmapMask = new Phaser.Display.Masks.BitmapMask(this, maskSprite);
        logo.setMask(bitmapMask);
    }
}

const config = {
    type: Phaser.WEBGL,
    backgroundColor: '#125555',
    width: 800,
    height: 600,
    pixelArt: true,
    scale: {
      mode: Phaser.Scale.ScaleModes.RESIZE,
    },
    scene: Demo
};

const game = new Phaser.Game(config);
