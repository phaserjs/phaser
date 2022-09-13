var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    dom: {
        createContainer: true
    },
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('logo', 'assets/sprites/phaser3-logo-x2.png');
}

function create ()
{
    var video = document.createElement('video');

    video.playsinline = true;
    video.src = 'assets/video/skull.mp4';
    video.width = 800;
    video.height = 450;
    video.autoplay = true;

    var element = this.add.dom(400, 300, video);

    video.addEventListener('ended', (event) => {

        element.setVisible(false);

        this.add.image(400, 300, 'logo');

    });
}
