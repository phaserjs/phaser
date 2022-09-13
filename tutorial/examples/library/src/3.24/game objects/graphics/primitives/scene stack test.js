class SceneA extends Phaser.Scene {

    constructor (config)
    {
        super({ key: 'SceneA', active: true });
    }

    preload ()
    {
        // this.load.image('metal', 'assets/textures/alien-metal.jpg');
        this.load.atlas('megaset', 'assets/atlas/megaset-0.png', 'assets/atlas/megaset-0.json');
    }

    create ()
    {
        this.cameras.main.setBackgroundColor(0xff0000);

        this.add.image(200, 300, 'megaset', 'phaser2');

        var graphics = this.add.graphics();

        graphics.fillStyle(0xffffff, 1);
        graphics.fillTriangle(200, 200, 400, 50, 500, 300);

        graphics.fillStyle(0x00ffff, 1);
        graphics.fillTriangle(60, 500, 60, 400, 500, 500);

        this.scene.launch('SceneC');
    }

}

class SceneB extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'SceneB', active: true });
    }

    create ()
    {
        // this.cameras.main.setViewport(100, 100, 600, 400);

        var graphics = this.add.graphics();

        graphics.fillStyle(0x00ff00, 1);

        graphics.beginPath();

        graphics.moveTo(400, 100);
        graphics.lineTo(200, 278);
        graphics.lineTo(340, 430);
        graphics.lineTo(650, 300);
        graphics.lineTo(700, 180);
        graphics.lineTo(600, 80);

        graphics.closePath();
        graphics.fillPath();
    }

}

class SceneC extends Phaser.Scene {

    constructor (config)
    {
        super('SceneC');
    }

    create ()
    {
        this.add.image(400, 300, 'megaset', 'cactuar');

        var graphics = this.add.graphics();

        graphics.fillStyle(0xffff00, 0.8);
        graphics.fillTriangle(400, 400, 690, 50, 780, 300);
    }

}

var config = {
    type: Phaser.WEBGL,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: [ SceneA, SceneB, SceneC ]
};

var game = new Phaser.Game(config);
