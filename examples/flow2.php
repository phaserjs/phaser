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

	var state = new Phaser.State();

	state.preload = function() {

		console.log('state preload called', this);

		//	When an instance of Phaser.State is added to Phaser.Game it becomes bound to that game
		//	which opens up lots of handy short-cuts to helpers and libs, such as this.math, this.load, this.cache, etc
		this.load.image('cockpit', 'assets/pics/cockpit.png');
		this.load.image('rememberMe', 'assets/pics/remember-me.jpg');
		this.load.image('overdose', 'assets/pics/lance-overdose-loader_eye.png');
		this.load.text('copyright', 'assets/warning - copyright.txt');

	}

	state.create = function() {

		console.log('state create called');

		//	Let's try adding an image to the DOM
		document.body.appendChild(this.cache.getImage('overdose'));

		//	And some text
		var para = document.createElement('pre');
		para.innerHTML = this.cache.getText('copyright');
		document.body.appendChild(para);

	}

	//	In this approach we're using a Phaser.State object and switching to it
	//	This gives us the advantage that from within state functions you can access 'this' and most the properties of Phaser.Game
	var game = new Phaser.Game(800, 600, Phaser.RENDERER_AUTO, '', state);

})();

</script>

</body>
</html>