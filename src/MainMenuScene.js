class MainMenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainMenu' });
    }

    preload() {
        // Preload assets like background images or buttons
        this.load.image('background', './ui/background.png'); // Add your actual image path
        this.load.image('playButton', './ui/playButton.png'); // Add your actual image path
        this.load.image('rankingButton', './ui/rankingButton.png'); // Add your actual image path
    }

    create() {

        //Add Main Menu text
        this.add.text(100, 100, 'Main Menu', { font: '24px Arial', fill: '#fff' });

        // Add background and buttons to the scene
        this.add.image(400, 300, 'background').setScale(0.5); // Adjust position as needed
        const playButton = this.add.image(400, 300, 'playButton').setInteractive();
        const rankingButton = this.add.image(400, 400, 'rankingButton').setInteractive();

        // Button interactions
        playButton.on('pointerdown', () => {
            this.scene.start('GameScene'); // Replace with the actual game scene name
        });
        rankingButton.on('pointerdown', () => {
            this.scene.start('RankingScene'); // Replace with the actual ranking scene name
        });
    }
}

export { MainMenuScene };