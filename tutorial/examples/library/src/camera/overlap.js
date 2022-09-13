class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload () 
    {
        this.load.image('CherilPerils', 'assets/tests/camera/CherilPerils.png');
        this.iter = 0;
    }

    create () 
    {
        this.image = this.add.image(0, 0, 'CherilPerils')
            .setOrigin(0);
        this.smallCamera = this.cameras.add(570, 30, 200, 200);
    }

    update () 
    {
        const halfWidth = this.image.texture.source[0].width / 2;
        const quarterWidth = halfWidth / 2;
        const halfHeight = this.image.texture.source[0].height / 2;
        const quarterHeight = halfHeight / 2;
    
        this.smallCamera.scrollX = halfWidth + Math.cos(this.iter) * halfWidth;
        this.iter += 0.02;
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
