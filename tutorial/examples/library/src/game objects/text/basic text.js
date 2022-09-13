var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: {
        create: create,
    }
};

var game = new Phaser.Game(config);

function create() 
{
    //  Default text with no style settings
    this.add.text(100, 100, 'Phaser');

    //  Pass in a basic style object with the constructor
    this.add.text(100, 200, 'Phaser', { fontFamily: 'Arial', fontSize: 64, color: '#00ff00' });

    //  Or chain calls like this:
    this.add.text(100, 400, 'Phaser').setFontFamily('Arial').setFontSize(64).setColor('#ffff00');
}
