<!DOCTYPE HTML>
<html>
<head>
	<title>phaser.js - a new beginning</title>
	<?php
		require('js.php');
	?>
</head>
<body>

<input type="button" id="menu" value="Main Menu" />
<input type="button" id="select" value="Level Select" />

<script type="text/javascript">

(function () {

	var preloader = {

		preload: function() {
			console.log('preloader.preload');
			game.load.image('nocooper', 'assets/pics/1984-nocooper-space.png');
			game.load.image('touhou', 'assets/pics/aya_touhou_teng_soldier.png');
		}

	}

	var mainMenu = {

		create: function() {
			console.log('mainMenu create');
			document.body.appendChild(game.cache.getImage('nocooper'));
		}
	}

	var levelSelect = {

		create: function() {
			console.log('levelSelect create');
			document.body.appendChild(game.cache.getImage('touhou'));
		}
	}

	//	No parameters given, which means no default state is created or started
	var game = new Phaser.Game();

	game.state.add('preloader', preloader, true);
	game.state.add('menu', mainMenu);
	game.state.add('select', levelSelect);

	var b1 = document.getElementById('menu').onclick = function() { game.state.start('menu') };
	var b2 = document.getElementById('select').onclick = function() { game.state.start('select') };

})();

</script>

</body>
</html>