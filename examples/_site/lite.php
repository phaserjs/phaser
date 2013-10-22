<?php
	require('funcs.php');
?>
<html lang='en' xml:lang='en' xmlns='http://www.w3.org/1999/xhtml'>
	<head>
		<meta content='text/html; charset=utf-8' http-equiv='Content-Type'>
		<style>
			@font-face {

				font-family: 'inconsolata';
				src: url('assets/html/inconsolata.woff') format('woff');
				font-weight: normal;
				font-style: normal;

			}

			body {

				background: #e0e4f1;
				margin: 0px;
				font-family: 'inconsolata';
				font-size: 15px;
				overflow: hidden;

			}

			a {
				text-decoration: none;
				color: #1c99bb;
			}

			a:hover {
				background-color: #e69b0b;
				color: #fff;
			}

			h1 {

				font-size: 25px;
				font-weight: normal;

			}

			h2 {

				font-size: 20px;
				font-weight: normal;

			}

			#header {
				background: url(assets/html/lite_header.jpg) no-repeat left top;
				width: 300px;
				height: 100px;
			}

			#panel {

				background: url(assets/html/lite_header_2.jpg) no-repeat left top;
				width: 300px;
				height: -webkit-calc(100% - 270px); /* Safari */
				height: calc(100% - 270px);
				overflow-x: hidden;
				overflow-y: scroll;

			}

				#panel #list {

					padding: 10px 20px;
					line-height: 18px;

				}

			#footer {
				background: url(assets/html/lite_footer.jpg) no-repeat left top;
				width: 300px;
				height: 170px;
				color: #000;
				text-align: center;
			}

			#viewer {

				position: absolute;
				top: 0px;
				left: 300px;
				width: -webkit-calc(100% - 300px); /* Safari */
				width: calc(100% - 300px);
				height: 100%;
				border: 0px;

			}
		</style>	
	</head>
	<body>

		<div id="header"></div>
		<div id="panel">
			<div id="list">
<?php
	foreach ($files as $key => $value)
	{
		//  If $key is an array, output it as an h2 or something
		if (is_array($value) && count($value) > 0)
		{
			echo "<h2>$key</h2>";

			echo printJSLinks($key, $value, 'viewer');
		}
	}
?>
			</div>
		</div>
		<div id="footer">
			<p>Total examples: <?php echo $total?></p>
			<p>Phaser version: 1.1</p>
			<p>Layout borrowed from three.js</p>
		</div>

		<iframe id="viewer"></iframe>

</body>
</html>