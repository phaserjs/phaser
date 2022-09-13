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

    this.load.xml('data', 'assets/loader-tests/test.xml');

}

function create() {

    var catalog = this.cache.xml.get('data');

    var books = catalog.getElementsByTagName('book');

    for (var i = 0; i < books.length; ++i)
    {
        var item = books[i];

        console.log(item.getAttribute('id'));
    }

}
