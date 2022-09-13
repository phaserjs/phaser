var iter = 0;
var horizontalCamera;
var verticalCamera;
var circularCamera;


class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('CherilPerils', 'assets/tests/camera/CherilPerils.png');
        this.load.image('clown', 'assets/sprites/clown.png');
    }

    create ()
    {
        this.image = this.add.image(0, 0, 'CherilPerils').setOrigin(0);

        this.cameras.main.setSize(400, 300);

        horizontalCamera = this.cameras.add(400, 0, 400, 300);
        verticalCamera = this.cameras.add(0, 300, 400, 300);
        circularCamera = this.cameras.add(400, 300, 400, 300);

        for (var i = 0; i < 1000; i++)
        {
            this.add.image(Math.random() * 1000, Math.random() * 1240, 'clown');
        }
    }

    update ()
    {
        var halfWidth = this.image.texture.source[0].width / 2;
        var quarterWidth = halfWidth / 2;
        var halfHeight = this.image.texture.source[0].height / 2;
        var quarterHeight = halfHeight / 2;

        horizontalCamera.scrollX = (halfWidth - quarterWidth + (Math.cos(iter) * quarterWidth))|0;
        verticalCamera.scrollY = (halfHeight - quarterHeight + (Math.sin(iter) * quarterHeight))|0;
        circularCamera.scrollX = (halfWidth - quarterWidth + (Math.cos(iter) * quarterWidth))|0;
        circularCamera.scrollY = (halfHeight - quarterHeight + (Math.sin(iter) * quarterHeight))|0;

        iter += 0.02;
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    scene: [ Example ],
    width: 800,
    height: 600
};

const game = new Phaser.Game(config);
