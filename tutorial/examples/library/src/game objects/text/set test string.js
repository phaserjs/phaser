var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    backgroundColor: '#8E8E8E',
    scene: {
        create: create,
    }
};

var game = new Phaser.Game(config);

function create() 
{
    this.add.text(100, 100, '⎝ example text', {
        fontSize: '48px',
        fontFamily: 'Arial',
        color: '#ffffff',
        backgroundColor: '#ff00ff',
        testString: 'abc'
    }).setStroke(0x111111, 6);

    this.add.text(100, 200, '⎝ example text', {
        fontSize: '48px',
        fontFamily: 'Arial',
        color: '#ffffff',
        backgroundColor: '#ff00ff',
        testString: '⎝|MÉqgy'
    }).setStroke(0x111111, 6);
}
