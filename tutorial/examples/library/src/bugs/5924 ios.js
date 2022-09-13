class Demo extends Phaser.Scene
{
    constructor()
    {
        super();
    }

    preload()
    {   
        this.load.multiatlas('megaset', 'assets/loader-tests/texture-packer-multi-atlas.json', 'assets/loader-tests/');
    }

    create()
    {
        var atlasTexture = this.textures.get('megaset');

        var frames = atlasTexture.getFrameNames();

        for (var i = 0; i < frames.length; i++)
        {
            var x = Phaser.Math.Between(0, 1024);
            var y = Phaser.Math.Between(100, 768);

            let image = this.add.image(x, y, 'megaset', frames[i]);

            this.add.tween({
                targets: image,
                x: x + Phaser.Math.Between(-100, 100),
                y: y + Phaser.Math.Between(-100, 100),
                yoyo: true,
                repeat: -1
            });
        }

        this.add.text(32, 32, 'iOS ' + this.renderer.maxTextures).setDepth(1000);
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#2d2d6d',
    scene: Demo
};

const game = new Phaser.Game(config);
