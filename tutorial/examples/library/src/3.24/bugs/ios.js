var screenWidth = 900;
var screenHeight = 1600;
var fps;
var config = {
    type: Phaser.WEBGL,
    width: screenWidth,
    height: screenHeight,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    backgroundColor: 0xF4F1EC
};

var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;
screenWidth = config.width = windowWidth;
screenHeight = config.height = windowHeight;
game = new Phaser.Game(config);

function preload()
{
    var assets = ['default_profile_pic', 'leaderboard_play'];
    var fonts = ['helvetica_48', 'big_john'];

    for (var asset of assets) {
        this.load.image(asset, 'assets/bugs/'  + asset + '.png');
    }
    for (var font of fonts) {
        this.load.bitmapFont(font, 'assets/bugs/'  + font + '.png', 'assets/bugs/' + font);
    }
}

function create()
{
    // fps = this.add.text(screenWidth * 0.83, screenHeight * 0.01, 'FPS', {'fontSize': 25 * screenWidth / 450}).setTint(0x483632);
    fps = this.add.bitmapText(screenWidth * 0.83, screenHeight * 0.01, 'helvetica_48', 'FPS');

    var leaderboardCenter = {
        x: screenWidth / 2, y: screenHeight * 0.56
    };
    var topY = screenHeight / 2;
    var offset = 2 * Math.abs(topY) / (5);

    for (var i = 1; i <= 5; i++) {
        var content = {};
        // create template elements
        content.photo = this.add.image(-screenWidth * 0.3 + leaderboardCenter.x, -topY + i * offset + leaderboardCenter.y, 'default_profile_pic');
        content.photo.depth = 18;
        content.photo.setScale(screenWidth / content.photo.width * 0.085, screenWidth / content.photo.width * 0.085);

        content.play = this.add.image(screenWidth * 0.3 + leaderboardCenter.x, -topY + i * offset + leaderboardCenter.y, 'leaderboard_play').setInteractive();
        content.play.depth = 18;
        content.play.setScale(screenWidth / content.play.width * 0.14, screenWidth / content.play.width * 0.14);

        content.name = this.add.bitmapText(-screenWidth * 0.1 + leaderboardCenter.x, -topY + i * offset + leaderboardCenter.y, 'helvetica_48', 'JOHN DOE', 24 * screenWidth / 450).setTint(0x483632).setOrigin(0.5, 0.4);
        content.name.depth = 18;

        content.score = this.add.bitmapText(screenWidth * 0.15 + leaderboardCenter.x, -topY + i * offset + leaderboardCenter.y, 'helvetica_48', '25', 24 * screenWidth / 450).setTint(0x483632).setOrigin(0.5, 0.4);
        content.score.depth = 18;
    }

}

function update(time, delta) {
    fps.setText(1 / delta * 1000);
}
