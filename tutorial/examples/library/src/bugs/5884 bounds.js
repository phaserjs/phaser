var config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('bg', 'assets/skies/background1.png');
}

function create ()
{
    this.add.image(400, 300, 'bg');


    var r4 = this.add.rectangle(200, 400, 148, 148, 0xff6699);
r4.setInteractive();
  r4.on('pointerover', () => {
    r4.setFillStyle(0x9966ff);
  })
    r4.on('pointerout', () => {
    r4.setFillStyle(0xff6699);
  })


}

setTimeout(() => {
  document.body.prepend(document.createElement("INPUT"))
}, 4000);
