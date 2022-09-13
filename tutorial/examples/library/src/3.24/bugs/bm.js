var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create,
    }
};

var game = new Phaser.Game(config);

function preload() {
    this.load.bitmapFont('desyrel', 'assets/fonts/bitmap/desyrel.png', 'assets/fonts/bitmap/desyrel.xml');
}

function create() {
    container = this.add.container(256, 256);
    text = this.make.dynamicBitmapText({x :0, y: 0, font: 'desyrel', text: 'It\'s cold outside,\nthere\'s no kind of atmosphere'});
    text.setSize(64, 64); // <= Nothing shows when cropped in this way

    //Uncomment line below to show correct...
    // text.setSize(container.x + 64, container.y + 64); // <= Will show correctly if you account for container x,y

    container.add(text);
}
