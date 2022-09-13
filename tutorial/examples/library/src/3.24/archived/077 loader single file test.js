var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    scene: {
        create: create
    }
};

var game = new Phaser.Game(config);

// function preload() {

    // this.load.image('logo', 'assets/atlas/megasetHD-0.png');
    // this.load.image('logo', 'http://examples.phaser.io/assets/atlas/megasetSD-0.png');

// }

function create() {

    console.log('create');

    var image = Phaser.Loader.ImageFile('logo', 'http://examples.phaser.io/assets/atlas/megasetSD-0.png');

    console.dir(image);

    image.load(function () {
        console.log('image done?');
    });

}

