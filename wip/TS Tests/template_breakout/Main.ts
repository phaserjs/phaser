/// <reference path="phaser.d.ts" />
/// <reference path="Boot.ts" />
/// <reference path="Preloader.ts" />
/// <reference path="MainMenu.ts" />
/// <reference path="GameState.ts" />

window.onload = function() {
	var game:Phaser.Game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameContainer', null, false, false);

	game.state.add("Boot", BasicGame.Boot);
	game.state.add("Preloader", BasicGame.Preloader);
	game.state.add("MainMenu", BasicGame.MainMenu);
	game.state.add("GameState", BasicGame.GameState );

	game.state.start("Boot");
}


