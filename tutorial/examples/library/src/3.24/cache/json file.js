var config = {
    type: Phaser.WEBGL,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload() {

    this.load.json('jsonData', 'assets/atlas/megaset-0.json');

}

function create() {

    console.log(this.cache.json.get('jsonData'));

}
