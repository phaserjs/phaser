<!DOCTYPE HTML>
<html>
<head>
	<title>phaser.js - a new beginning</title>
	<?php
		require('js.php');
	?>
</head>
<body>

<textarea id="output" style="width: 1400px; height: 600px"></textarea>
<br />
<input type="button" id="grab" value="Grab" />
<input type="button" id="refresh" value="Refresh" />

<script type="text/javascript">

	var game = new Phaser.Game(50, 31, Phaser.CANVAS, '', { preload: preload, create: create });

	function preload() {
		game.load.image('piccie', 'assets/bd/burd.png');
	}

	var logo;
    var args;

	function create() {

		logo = game.add.sprite(0, 0, 'piccie');

        document.getElementById('grab').onclick = canvasToConsole;
        document.getElementById('refresh').onclick = refreshConsole;

	}

    function refreshConsole () {

        args[0] = document.getElementById('output').value;
        console.clear();
        console.log.apply(console, args);
        console.log(args.toString());

    }

    function canvasToConsole () {

      var txt = "";
      var prev;
      args = [""];
      var lfb = game.renderer.context.getImageData(0, 0, game.width, game.height).data;

      for (var i = 0, j = 0; i < 1500; i++, j++)
      {
        if (!(i % 50)) // if(i && !(i % 50)) if don't like to start with a "\n"
            txt += prev = "\n";

        var col = "background: rgb(" + [lfb[j++], lfb[j++], lfb[j++]] + ")";
        if (col == prev)
        {
          txt += "  ";
        }
        else
        {
          txt += "%c  ";
          args.push(col);
          prev = col;
        }
      }

      args[0] = txt;
      document.getElementById('output').innerText = args[0];
      console.clear();
      console.log.apply(console, args);
      // console.log(args[0]);

    }

</script>

</body>
</html>