var config = {
    type: Phaser.CANVAS,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('volcano', 'assets/pics/the-end-by-iloe-and-made.jpg');
    this.load.image('hotdog', 'assets/sprites/hotdog.png');
    this.load.image('logo', 'assets/sprites/phaser3-logo-small.png');
}

function create ()
{
    var volcano = this.add.image(400, 300, 'volcano');
    var hotdog = this.add.image(400, 600, 'hotdog');

    this.cameras.main.setRenderToTexture();

    //  Apply a simple post-render scan line effect to the Camera canvas

    this.cameras.main.on('postrender', function (camera) {

        camera.context.fillStyle = 'rgba(0, 0, 0, 0.5)';

        for (var y = 0; y < camera.canvas.height; y += 2)
        {
            camera.context.fillRect(0, y, camera.canvas.width, 1);
        }

    });

    this.tweens.add({
        targets: hotdog,
        y: 0,
        duration: 2000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut'
    });
}
