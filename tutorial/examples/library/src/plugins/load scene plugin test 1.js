const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
};

let game = new Phaser.Game(config);

function preload ()
{
    this.load.scenePlugin('FractalPlugin', 'assets/loader-tests/FractalScenePlugin.js', 'fractalPlugin', 'fractals');

    // this.load.scenePlugin({
    //     key: 'FractalPlugin',
    //     url: 'assets/loader-tests/FractalScenePlugin.js',
    //     sceneKey: 'fractals'
    // });
}

function create ()
{
    var image = this.fractals.create(400, 300, 256, 256);

    image.setScale(2);

    this.tweens.add({

        targets: this.fractals,
        v1: 1.5,
        v2: -3.0,
        v3: 1.0,
        v4: -2.0,
        duration: 4000,
        yoyo: true,
        repeat: -1

    });

    this.tweens.add({

        targets: this.fractals,
        c1: 16,
        c2: 10,
        c3: 0,
        duration: 16000,
        yoyo: true,
        repeat: -1

    });
}
