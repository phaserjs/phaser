$(document).ready(function(){

	var dir = $.url().param('d');
	var file = $.url().param('f');
	var title = $.url().param('t');

	document.title = 'phaser - ' + title;

	$("#title").append(title);

	$.getScript(dir + "/" + file)

	.done(function(script, textStatus) {

		$.ajax({ url: dir + "/" + file, dataType: "text" }).done(function(data) { $("#sourcecode").text(data); });

		//	Hook up the control panel

		$(".pause-button").click(function() {
			if (game.paused)
			{
				game.paused = false;
			}
			else
			{
				game.paused = true;
			}
		});

		$(".mute-button").click(function() {
			if (game.sound.mute)
			{
				game.sound.mute = false;
			}
			else
			{
				game.sound.mute = true;
			}
		});

		$(".reset-button").click(function() {
			document.location.reload(true);
		});

  	})

	.fail(function(jqxhr, settings, exception) {

		$("#title").text("Error");

		var node = '<p>Unable to load <u>' + dir + '/' + file + '</u></p>';

		$('#phaser-example').append(node);

	});

	$.getJSON("http://phaser.io/version.json")

	.done(function(data) {

		if (data.version !== '1.1.3')
		{
			$("#upgrade").append(data.version);
			$("#upgrade").css('display', 'inline-block');
		}

	});

});
