<?php
	$title = "Multiple Animations";
	require('../head.php');
?>

<script type="text/javascript">

(function () {

	var game = new Phaser.Game(800, 600, Phaser.CANVAS, '', { preload: preload, create: create });

	function preload() {
		game.load.atlas('bot', 'assets/misc/NumberSprite.png', 'assets/misc/NumberSprite.json');
	}

	function create() {

		var bot = game.add.sprite(200, 200, 'bot');

		bot.animations.add('num1', ['num10000','num10001','num10002','num10003','num10004','num10005'], 24, false, false);
		bot.animations.add('num2', ['num20000','num20001','num20002','num20003','num20004','num20005'], 24, false, false);
		bot.animations.add('num3', ['num30000','num30001','num30002','num30003','num30004','num30005'], 24, false, false);

		// bot.animations.play('num1', 15, true);
		bot.animations.play('num2', 15, true);
		// bot.animations.play('num3', 15, true);

	}

})();

</script>

<?php
	require('../foot.php');
?>