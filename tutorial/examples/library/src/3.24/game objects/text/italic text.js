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
    this.add.text(100, 20, 'Without Padding');

    this.add.text(100, 100, 'Phaser').setFontSize(64).setFontStyle('bold italic').setFontFamily('Arial').setBackgroundColor('#0000ff');
    this.add.text(100, 200, '继续').setFontSize(64).setFontStyle('bold italic').setFontFamily('Open Sans').setBackgroundColor('#0000ff');

    this.add.text(450, 20, 'With Padding');

    this.add.text(450, 100, 'Phaser').setFontSize(64).setFontStyle('bold italic').setFontFamily('Arial').setPadding({ right: 16 }).setBackgroundColor('#0000ff');
    this.add.text(450, 200, '继续').setFontSize(64).setFontStyle('bold italic').setFontFamily('Open Sans').setPadding({ right: 16 }).setBackgroundColor('#0000ff');
}
