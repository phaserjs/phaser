class SceneA extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'sceneA' });
    }

    preload ()
    {
        this.load.spritesheet('bobs', 'assets/sprites/bobs-by-cleathley.png', { frameWidth: 32, frameHeight: 32 });
    }

    create ()
    {
        for (var i = 0; i < 5000; i++)
        {
            var x = Phaser.Math.Between(0, 2500);
            var y = Phaser.Math.Between(0, 2500);
            var frame = Phaser.Math.Between(0, 399);

            var bob = this.add.sprite(x, y, 'bobs', frame);

            if (i % 2)
            {
                //  Hide every other sprite, it will still be on the display list though
                bob.setVisible(false);
            }
        }

        this.add.text(10, 10, 'Scene A', { font: '16px Courier', fill: '#ffffff' });

        this.input.once('pointerup', function () {

            this.scene.start('sceneB');

        }, this);
    }

}

class SceneB extends Phaser.Scene {

    constructor ()
    {
        super({ key: 'sceneB' });
    }

    create ()
    {
        for (var i = 0; i < 5000; i++)
        {
            var x = Phaser.Math.Between(0, 2500);
            var y = Phaser.Math.Between(0, 2500);
            var frame = Phaser.Math.Between(0, 399);

            var bob = this.add.sprite(x, y, 'bobs', frame);

            if (i % 2)
            {
                //  Hide every other sprite, it will still be on the display list though
                bob.setVisible(false);
            }
        }

        this.add.text(10, 10, 'Scene B', { font: '16px Courier', fill: '#ffffff' });

        this.input.once('pointerup', function () {

            this.scene.start('sceneA');

        }, this);
    }

}

var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    parent: 'phaser-example',
    scene: [ SceneA, SceneB ]
};

var game = new Phaser.Game(config);
