class MyScene extends Phaser.Scene {

    preload ()
    {
        this.load.image('face', 'assets/pics/bw-face.png');
    }

    create (data)
    {
        this.face = this.add.image(data.x, data.y, 'face');
    }

}

class BootScene extends Phaser.Scene {

    create ()
    {
        this.add.text(0, 0, 'Click to add new Scene');

        this.input.once('pointerdown', function () {
        
            this.scene.add('myScene', MyScene, true, { x: 400, y: 300 });

        }, this);
    }

}

var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: BootScene
};

var game = new Phaser.Game(config);
