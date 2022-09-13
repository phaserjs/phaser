var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    scene: [ Preloader, MainMenu, Game ]
};

var game = new Phaser.Game(config);
