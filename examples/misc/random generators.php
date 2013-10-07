<?php
	$title = "Random Data Generators";
	require('../head.php');
?>

<script type="text/javascript">



	var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {create: create });


	function create() {

		game.stage.backgroundColor = '#454645';

		var style = { font: "14px Arial", fill: "#ff0044", align: "center" };

		game.add.text(10,20,game.rnd.integer());
		game.add.text(10,40,game.rnd.frac());
		game.add.text(10,60,game.rnd.real());
		game.add.text(10,80,game.rnd.integerInRange(100,200));

	}



</script>

<?php
	require('../foot.php');
?>