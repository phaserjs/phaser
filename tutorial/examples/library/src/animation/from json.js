class Example extends Phaser.Scene
{
    constructor ()
    {
        super();
    }

    preload ()
    {
        this.load.atlas('gems', 'assets/tests/columns/gems.png', 'assets/tests/columns/gems.json');

    }

    create ()
    {
        this.add.text(400, 32, 'Animations from JSON Object', { color: '#00ff00' }).setOrigin(0.5, 0);

        this.anims.fromJSON(data);

        this.add.sprite(400, 200, 'gems').play('diamond');
        this.add.sprite(400, 300, 'gems').play('prism');
        this.add.sprite(400, 400, 'gems').play('ruby');
        this.add.sprite(400, 500, 'gems').play('square');
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

// Hoisting
const data = {
    "anims": [
        {
            "key": "diamond",
            "type": "frame",
            "frames": [
                {
                    "key": "gems",
                    "frame": "diamond_0000",
                    "duration": 0,
                    "visible": false
                },
                {
                    "key": "gems",
                    "frame": "diamond_0001",
                    "duration": 0,
                    "visible": false
                },
                {
                    "key": "gems",
                    "frame": "diamond_0002",
                    "duration": 0,
                    "visible": false
                },
                {
                    "key": "gems",
                    "frame": "diamond_0003",
                    "duration": 0,
                    "visible": false
                },
                {
                    "key": "gems",
                    "frame": "diamond_0004",
                    "duration": 0,
                    "visible": false
                },
                {
                    "key": "gems",
                    "frame": "diamond_0005",
                    "duration": 0,
                    "visible": false
                },
                {
                    "key": "gems",
                    "frame": "diamond_0006",
                    "duration": 0,
                    "visible": false
                },
                {
                    "key": "gems",
                    "frame": "diamond_0007",
                    "duration": 0,
                    "visible": false
                },
                {
                    "key": "gems",
                    "frame": "diamond_0008",
                    "duration": 0,
                    "visible": false
                },
                {
                    "key": "gems",
                    "frame": "diamond_0009",
                    "duration": 0,
                    "visible": false
                },
                {
                    "key": "gems",
                    "frame": "diamond_0010",
                    "duration": 0,
                    "visible": false
                },
                {
                    "key": "gems",
                    "frame": "diamond_0011",
                    "duration": 0,
                    "visible": false
                },
                {
                    "key": "gems",
                    "frame": "diamond_0012",
                    "duration": 0,
                    "visible": false
                },
                {
                    "key": "gems",
                    "frame": "diamond_0013",
                    "duration": 0,
                    "visible": false
                },
                {
                    "key": "gems",
                    "frame": "diamond_0014",
                    "duration": 0,
                    "visible": false
                },
                {
                    "key": "gems",
                    "frame": "diamond_0015",
                    "duration": 0,
                    "visible": false
                }
            ],
            "frameRate": 24,
            "duration": 1.5,
            "skipMissedFrames": true,
            "delay": 0,
            "repeat": -1,
            "repeatDelay": 0,
            "yoyo": false,
            "showOnStart": false,
            "hideOnComplete": false
        },
        {
            "key": "prism",
            "type": "frame",
            "frames": [
                {
                    "key": "gems",
                    "frame": "prism_0000",
                    "duration": 0,
                    "visible": false
                },
                {
                    "key": "gems",
                    "frame": "prism_0001",
                    "duration": 0,
                    "visible": false
                },
                {
                    "key": "gems",
                    "frame": "prism_0002",
                    "duration": 0,
                    "visible": false
                },
                {
                    "key": "gems",
                    "frame": "prism_0003",
                    "duration": 0,
                    "visible": false
                },
                {
                    "key": "gems",
                    "frame": "prism_0004",
                    "duration": 0,
                    "visible": false
                },
                {
                    "key": "gems",
                    "frame": "prism_0005",
                    "duration": 0,
                    "visible": false
                },
                {
                    "key": "gems",
                    "frame": "prism_0006",
                    "duration": 0,
                    "visible": false
                }
            ],
            "frameRate": 24,
            "duration": 3.4285714285714284,
            "skipMissedFrames": true,
            "delay": 0,
            "repeat": -1,
            "repeatDelay": 0,
            "yoyo": false,
            "showOnStart": false,
            "hideOnComplete": false
        },
        {
            "key": "ruby",
            "type": "frame",
            "frames": [
                {
                    "key": "gems",
                    "frame": "ruby_0000",
                    "duration": 0,
                    "visible": false
                },
                {
                    "key": "gems",
                    "frame": "ruby_0001",
                    "duration": 0,
                    "visible": false
                },
                {
                    "key": "gems",
                    "frame": "ruby_0002",
                    "duration": 0,
                    "visible": false
                },
                {
                    "key": "gems",
                    "frame": "ruby_0003",
                    "duration": 0,
                    "visible": false
                },
                {
                    "key": "gems",
                    "frame": "ruby_0004",
                    "duration": 0,
                    "visible": false
                },
                {
                    "key": "gems",
                    "frame": "ruby_0005",
                    "duration": 0,
                    "visible": false
                },
                {
                    "key": "gems",
                    "frame": "ruby_0006",
                    "duration": 0,
                    "visible": false
                }
            ],
            "frameRate": 24,
            "duration": 3.4285714285714284,
            "skipMissedFrames": true,
            "delay": 0,
            "repeat": -1,
            "repeatDelay": 0,
            "yoyo": false,
            "showOnStart": false,
            "hideOnComplete": false
        },
        {
            "key": "square",
            "type": "frame",
            "frames": [
                {
                    "key": "gems",
                    "frame": "square_0000",
                    "duration": 0,
                    "visible": false
                },
                {
                    "key": "gems",
                    "frame": "square_0001",
                    "duration": 0,
                    "visible": false
                },
                {
                    "key": "gems",
                    "frame": "square_0002",
                    "duration": 0,
                    "visible": false
                },
                {
                    "key": "gems",
                    "frame": "square_0003",
                    "duration": 0,
                    "visible": false
                },
                {
                    "key": "gems",
                    "frame": "square_0004",
                    "duration": 0,
                    "visible": false
                },
                {
                    "key": "gems",
                    "frame": "square_0005",
                    "duration": 0,
                    "visible": false
                },
                {
                    "key": "gems",
                    "frame": "square_0006",
                    "duration": 0,
                    "visible": false
                },
                {
                    "key": "gems",
                    "frame": "square_0007",
                    "duration": 0,
                    "visible": false
                },
                {
                    "key": "gems",
                    "frame": "square_0008",
                    "duration": 0,
                    "visible": false
                },
                {
                    "key": "gems",
                    "frame": "square_0009",
                    "duration": 0,
                    "visible": false
                },
                {
                    "key": "gems",
                    "frame": "square_0010",
                    "duration": 0,
                    "visible": false
                },
                {
                    "key": "gems",
                    "frame": "square_0011",
                    "duration": 0,
                    "visible": false
                },
                {
                    "key": "gems",
                    "frame": "square_0012",
                    "duration": 0,
                    "visible": false
                },
                {
                    "key": "gems",
                    "frame": "square_0013",
                    "duration": 0,
                    "visible": false
                },
                {
                    "key": "gems",
                    "frame": "square_0014",
                    "duration": 0,
                    "visible": false
                }
            ],
            "frameRate": 24,
            "duration": 1.6,
            "skipMissedFrames": true,
            "delay": 0,
            "repeat": -1,
            "repeatDelay": 0,
            "yoyo": false,
            "showOnStart": false,
            "hideOnComplete": false
        }
    ],
    "globalTimeScale": 1
};
