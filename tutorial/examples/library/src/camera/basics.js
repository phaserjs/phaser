class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.image('robot', 'assets/pics/robota-uxo-by-made-of-bomb.jpg');
    }

    create ()
    {
        const gui = new dat.GUI();

        //  Our image is 1920 x 989.
        //  Our game canvas is 800 x 600.
        this.add.image(0, 0, 'robot').setOrigin(0);

        // camera1 = this.cameras.main;
        const camera1 = this.cameras.add(0, 0, 400, 300).setZoom(0.5);

        gui.addFolder('Camera 1');
        gui.add(camera1, 'x');
        gui.add(camera1, 'y');
        gui.add(camera1, 'width');
        gui.add(camera1, 'height');
        gui.add(camera1, 'centerToSize');
        gui.add(camera1, 'scrollX', -1920, 1920);
        gui.add(camera1, 'scrollY', -989, 989);
        gui.add(camera1, 'zoom', 0.1, 2).step(0.1);
        gui.add(camera1, 'rotation').step(0.01);
        gui.addColor(camera1, 'backgroundColor').onChange(function (value) {
            value.a = 255;
            camera1.setBackgroundColor(value);
        });
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: [ Example ]
};

const game = new Phaser.Game(config);
