<!DOCTYPE HTML>
<html>
<head>
	<title>phaser.js - a new beginning</title>
	<?php
		require('js.php');
	?>
</head>
<body>

<script type="text/javascript">

(function () {

	var mainMenu = {

		preload: function() {
			console.log('mainMenu preload');
			game.load.image('nocooper', 'assets/pics/1984-nocooper-space.png');
		},

		create: function() {
			console.log('mainMenu create');
			document.body.appendChild(game.cache.getImage('nocooper'));
		}
	}

	var levelSelect = {

		preload: function() {
			console.log('levelSelect preload');
			game.load.image('touhou', 'assets/pics/aya_touhou_teng_soldier.png');
		},

		create: function() {
			console.log('levelSelect create');
			document.body.appendChild(game.cache.getImage('touhou'));
		}
	}

	//	No parameters given, which means no default state is created or started
	var game = new Phaser.Game();

	//	In this example we've created 2 states above (mainMenu and levelSelect)
	//	We'll add them both to the game
	game.state.add('menu', mainMenu);
	game.state.add('select', levelSelect);

	//	Now we can either start the state we want directly, or we could have passed 'true' as the 3rd parameter in state.add
	game.state.start('select');

})();

</script>

</body>
</html>