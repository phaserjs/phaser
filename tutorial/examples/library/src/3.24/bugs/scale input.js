const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    scale: {
        mode: Phaser.Scale.RESIZE,
        width: 800, 
        height: 600
    },
    scene: {
        create: create
    }
};

let game = new Phaser.Game(config);

function create ()
{
    this.add.text(10, 10, 'text text text', { font: '16px Courier', fill: '#00ff00' }).setInteractive().on('pointerdown', function () {
        console.log('this.style.color '+this.style.color)
        this.style.color == '#ff0000' ? this.setColor('#00ff00') : this.setColor('#ff0000')
    })

    this.game.events.on('destroy', () => {
        game = new Phaser.Game(config);
    });

    this.add.text(10, 400, 'destroy game', { font: '16px Courier', fill: '#00ffff' }).setInteractive().on('pointerdown', function () {
        this.sys.game.destroy(true);
    }, this);
}