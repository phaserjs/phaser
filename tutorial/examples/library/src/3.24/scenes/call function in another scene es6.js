class SceneA extends Phaser.Scene {

    constructor ()
    {
        super('MyFirstScene');
    }

    preload ()
    {
        this.load.image('asuna', 'assets/sprites/asuna_by_vali233.png');
    }

    create ()
    {
        this.input.on('pointerup', this.clickHandler, this);

        this.add.text(10, 10, 'Click to get image', { font: '16px Courier', fill: '#00ff00' }).setDepth(1000);
    }

    clickHandler ()
    {
        let sceneB = this.scene.get('MySecondScene');

        let position = sceneB.getPosition();

        this.add.image(position.x, position.y, 'asuna');
    }

}

class SceneB extends Phaser.Scene {

    constructor ()
    {
        super('MySecondScene');
    }

    getPosition ()
    {
        let x = Phaser.Math.Between(0, 800);
        let y = Phaser.Math.Between(0, 600);

        return new Phaser.Math.Vector2(x, y);
    }

}

let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2d2d2d',
    parent: 'phaser-example',
    scene: [ SceneA, SceneB ]
};

let game = new Phaser.Game(config);
