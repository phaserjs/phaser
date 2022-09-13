class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('logo', 'assets/sprites/phaser1.png');
        this.load.image('bunny', 'assets/sprites/bunny.png');
        this.load.image('bg', 'assets/pics/platformer-backdrop.png');
        this.load.image('checker', 'assets/pics/checker.png');
    }

    create ()
    {
        const bg = this.add.sprite(400, 300, 'bg').setOrigin(0.5).setScale(2.5);

        const logo = this.make.sprite({key:'logo', add: false}).setScale(0.2);
        const rt = this.make.renderTexture({x: 0, y: 0, width: 800, height: 600, add: false}).setOrigin(0.0);

        const bunny1 = this.add.sprite(400, 300, 'bunny').setTint(0x000000);
        const checker = this.add.sprite(400, 300, 'checker');
        const bunny0 = this.add.sprite(400, 300, 'bunny')

        bunny0.mask = new Phaser.Display.Masks.BitmapMask(this, rt);
        bunny0.mask.invertAlpha = true;
        checker.mask = new Phaser.Display.Masks.BitmapMask(this, bunny1);

        this.input.on('pointermove', function (event) {
            if (event.isDown)
            {
                rt.draw(logo, event.x, event.y);
            }
        }, this);
    }
}


const config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: [ Example ]
};

const game = new Phaser.Game(config);
