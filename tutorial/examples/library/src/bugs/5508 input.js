var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#010101',
    parent: 'phaser-example',
    scene: {
    preload: preload,
    create: create
    }
    };
    var game = new Phaser.Game(config);
    function preload () {
    this.load.image('lemming', 'assets/sprites/lemming.png');
    }
    function create () {
    // if you comment this line, pointerdown will work as expected
    const dropArea = this.add.sprite(400, 320, 'lemming').setInteractive({dropZone: true});
    const container = this.add.container(400, 300);
    const sprite0 = this.add.sprite(0, 0, 'lemming');
    container.add(sprite0).setSize(64, 64)
    .setInteractive()
    .on('pointerdown', () => console.log('I will never happen :-('));;
    }
