class GameStartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameStartScene' });
    }

    preload() {
        // Load assets
        this.load.image('titleImage', './src/ui/title.png');
        this.load.image('backButton', './src/ui/ButtonsText/ButtonText_Small_ROund.png');
        this.load.image('startButton', './src/ui/ButtonsText/ButtonText_Small_ROund.png');
    }

    create() {
        // Spacing variables
        const centerX = this.cameras.main.width / 2;
        const spacing = 40; // Vertical spacing between items
        let currentY = this.cameras.main.height * 0.2; // Starting position (20% of screen height)

        // Title Image
        const title = this.add.image(centerX, currentY, 'titleImage')
            .setOrigin(0.5)
            .setScale(0.3);
        
        // Update Y position
        currentY += title.displayHeight + spacing;

        // Start Button
        const startButton = this.add.image(centerX, currentY, 'startButton')
            .setInteractive()
            .setOrigin(0.5)
            .setScale(0.2);
        this.add.text(startButton.x, startButton.y, 'Start', { font: '20px Arial', fill: '#ffffff' }).setOrigin(0.5);
        
        // Update Y position
        currentY += startButton.displayHeight + spacing;

        // Back Button
        const backButton = this.add.image(centerX, currentY, 'backButton')
            .setInteractive()
            .setOrigin(0.5)
            .setScale(0.2);
        this.add.text(backButton.x, backButton.y, 'Back', { font: '20px Arial', fill: '#ffffff' }).setOrigin(0.5);
        
        // Update Y position
        currentY += backButton.displayHeight + spacing;

        // Game Rules
        const rulesText = `
            Game Rules:
            1) Players start with 3 life points.
            2) Each stage has 3 rounds.
            3) Win 2 out of 3 rounds to progress.
            4) A 10-second timer limits each choice.
            5) Earn points for each win and get bonus life points every 3 stages.
        `;
        this.add.text(40, currentY, rulesText, {
            font: '16px Arial',
            fill: '#ffffff',
            align: 'left',
            wordWrap: { width: this.cameras.main.width - 80, useAdvancedWrap: true }
        }).setOrigin(0, 0.5);

        // Button Interactions
        startButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });

        backButton.on('pointerdown', () => {
            this.scene.start('MainMenu');
        });
    }
}

export { GameStartScene };