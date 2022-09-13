class MainScene extends Phaser.Scene {

    constructor ()
    {
        super('MainScene');
    }

    preload ()
    {
        this.load.image('sky', 'assets/skies/lightblue.png');
    }

    create ()
    {
        this.scene.start('SceneA');
    }
}

class SceneA extends Phaser.Scene {

    constructor ()
    {
        super('SceneA');
    }

    create ()
    {
        this.wibble();

        this.add.image(0, 0, 'sky').setOrigin(0);

        this.add.text(10, 10, 'Testing Broken Scene A', { font: '16px Courier', fill: '#ffffff' });
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: [ MainScene, SceneA ]
};

const game = new Phaser.Game(config);
