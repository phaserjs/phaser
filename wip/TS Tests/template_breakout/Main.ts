/// <reference path="phaser.d.ts" />
/// <reference path="Boot.ts" />
/// <reference path="Preloader.ts" />
/// <reference path="MainMenu.ts" />

window.onload = function() {
	var game:Phaser.Game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameContainer', null, false, false);

	game.state.add("Boot", BasicGame.Boot, false);
	game.state.add("Preloader", BasicGame.Preloader, false);
	game.state.add("MainMenu", BasicGame.MainMenu, false );

	game.state.start("Boot");
}


