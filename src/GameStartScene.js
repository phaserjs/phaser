import { MainMenuScene } from './MainMenuScene.js'; // Import if needed for scene management

class GameStartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameStartScene' });
    }

    preload() {
        // Preload title image or other assets for the Game Start Page
        this.load.image('titleImage', './src/ui/title.png');
        this.load.image('backButton', './src/ui/ButtonsText/ButtonText_Small_ROund.png'); // Button to go back to main menu
        this.load.image('startButton', './src/ui/ButtonsText/ButtonText_Small_ROund.png'); // Button to start the game
    }

    create() {
        // Title Image at the top with margin
        const title = this.add.image(this.cameras.main.width / 2, 50, 'titleImage')
            .setOrigin(0.5)
            .setScale(0.3);

        // Display Game Rules as text
        const rulesText = `
            Game Rules:
            1) Players start with 3 life points.
            2) Each stage has 3 rounds.
            3) Win 2 out of 3 rounds to progress.
            4) A 10-second timer limits each choice.
            5) Earn points for each win and get bonus life points every 3 stages.
        `;
        this.add.text(this.cameras.main.width / 2, 150, rulesText, {
            font: '18px Arial',
            fill: '#ffffff',
            align: 'center',
            wordWrap: { width: this.cameras.main.width - 40 }
        }).setOrigin(0.5);

        // Start Button
        const startButton = this.add.image(this.cameras.main.width / 2, 400, 'startButton')
            .setInteractive()
            .setOrigin(0.5)
            .setScale(0.2);
        this.add.text(startButton.x, startButton.y, 'Start', { font: '20px Arial', fill: '#ffffff' }).setOrigin(0.5);

        // Back Button
        const backButton = this.add.image(this.cameras.main.width / 2, 500, 'backButton')
            .setInteractive()
            .setOrigin(0.5)
            .setScale(0.2);
        this.add.text(backButton.x, backButton.y, 'Back', { font: '20px Arial', fill: '#ffffff' }).setOrigin(0.5);

        // Button interactions
        startButton.on('pointerdown', () => {
            this.scene.start('GameScene'); // Replace with your actual game scene
        });
        backButton.on('pointerdown', () => {
            this.scene.start('MainMenu'); // Returns to Main Menu
        });
    }
}

export { GameStartScene };
