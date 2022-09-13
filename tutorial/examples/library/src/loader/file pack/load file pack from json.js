var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.pack('pack1', FilePackObject);
}

function create ()
{
    this.add.image(400, 300, 'taikodrummaster');
    this.add.image(400, 500, 'sukasuka-chtholly');
}

var FilePackObject = { 
    "test1": {
        "files": [
            {
                "type": "image",
                "key": "taikodrummaster",
                "url": "assets/pics/taikodrummaster.jpg"
            },
            {
                "type": "image",
                "key": "sukasuka-chtholly",
                "url": "assets/pics/sukasuka-chtholly.png"
            }
        ]
    },
    "test2": {
        "prefix": "TEST2.",
        "path": "assets/pics",
        "defaultType": "image",
        "files": [
            {
                "key": "donuts",
                "extension": "jpg"
            },
            {
                "key": "ayu"
            }
        ]
    },
    "meta": {
        "generated": "1401380327373",
        "app": "Phaser 3 Asset Packer",
        "url": "https://phaser.io",
        "version": "1.0",
        "copyright": "Photon Storm Ltd. 2018"
    }
};
