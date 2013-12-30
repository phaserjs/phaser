<?php
	//	All JS files in build order.
	//	Much easier for debugging re: line numbers
	if (!isset($path))
	{
		$path = '..';
	}

	echo <<<EOL

    <script src="$path/src/Intro.js"></script>
    <script src="$path/src/pixi/Pixi.js"></script>
    <script src="$path/src/Phaser.js"></script>
    <script src="$path/src/utils/Utils.js"></script>

    <script src="$path/src/pixi/core/Matrix.js"></script>
    <script src="$path/src/pixi/core/Point.js"></script>
    <script src="$path/src/pixi/core/Rectangle.js"></script>
    <script src="$path/src/pixi/core/Polygon.js"></script>

    <script src="$path/src/pixi/display/DisplayObject.js"></script>
    <script src="$path/src/pixi/display/DisplayObjectContainer.js"></script>
    <script src="$path/src/pixi/display/Sprite.js"></script>
    <script src="$path/src/pixi/display/Stage.js"></script>

    <script src="$path/src/pixi/extras/CustomRenderable.js"></script>
    <script src="$path/src/pixi/extras/Strip.js"></script>
    <script src="$path/src/pixi/extras/Rope.js"></script>
    <script src="$path/src/pixi/extras/TilingSprite.js"></script>

    <script src="$path/src/pixi/filters/AbstractFilter.js"></script>
    <script src="$path/src/pixi/filters/FilterBlock.js"></script>

    <script src="$path/src/pixi/primitives/Graphics.js"></script>

    <script src="$path/src/pixi/renderers/canvas/CanvasGraphics.js"></script>
    <script src="$path/src/pixi/renderers/canvas/CanvasRenderer.js"></script>

    <script src="$path/src/pixi/renderers/webgl/PixiShader.js"></script>
    <script src="$path/src/pixi/renderers/webgl/PrimitiveShader.js"></script>
    <script src="$path/src/pixi/renderers/webgl/StripShader.js"></script>
    <script src="$path/src/pixi/renderers/webgl/WebGLBatch.js"></script>
    <script src="$path/src/pixi/renderers/webgl/WebGLFilterManager.js"></script>
    <script src="$path/src/pixi/renderers/webgl/WebGLGraphics.js"></script>
    <script src="$path/src/pixi/renderers/webgl/WebGLRenderer.js"></script>
    <script src="$path/src/pixi/renderers/webgl/WebGLRenderGroup.js"></script>
    <script src="$path/src/pixi/renderers/webgl/WebGLShaders.js"></script>

    <script src="$path/src/pixi/text/BitmapText.js"></script>
    <script src="$path/src/pixi/text/Text.js"></script>

    <script src="$path/src/pixi/textures/BaseTexture.js"></script>
    <script src="$path/src/pixi/textures/Texture.js"></script>

    <script src="$path/src/pixi/utils/EventTarget.js"></script>
    <script src="$path/src/pixi/utils/Polyk.js"></script>

	<script src="$path/src/core/Camera.js"></script>
	<script src="$path/src/core/State.js"></script>
	<script src="$path/src/core/StateManager.js"></script>
	<script src="$path/src/core/LinkedList.js"></script>
	<script src="$path/src/core/Signal.js"></script>
	<script src="$path/src/core/SignalBinding.js"></script>
	<script src="$path/src/core/Filter.js"></script>
	<script src="$path/src/core/Plugin.js"></script>
	<script src="$path/src/core/PluginManager.js"></script>
	<script src="$path/src/core/Stage.js"></script>
	<script src="$path/src/core/Group.js"></script>
	<script src="$path/src/core/World.js"></script>
	<script src="$path/src/core/Game.js"></script>

	<script src="$path/src/input/Input.js"></script>
	<script src="$path/src/input/Key.js"></script>
	<script src="$path/src/input/Keyboard.js"></script>
	<script src="$path/src/input/Mouse.js"></script>
	<script src="$path/src/input/MSPointer.js"></script>
	<script src="$path/src/input/Pointer.js"></script>
	<script src="$path/src/input/Touch.js"></script>
	<script src="$path/src/input/Gamepad.js"></script>
    <script src="$path/src/input/SinglePad.js"></script>
    <script src="$path/src/input/GamepadButton.js"></script>
	<script src="$path/src/input/InputHandler.js"></script>

	<script src="$path/src/gameobjects/Events.js"></script>
	<script src="$path/src/gameobjects/GameObjectFactory.js"></script>
	<script src="$path/src/gameobjects/BitmapData.js"></script>
	<script src="$path/src/gameobjects/Sprite.js"></script>
	<script src="$path/src/gameobjects/TileSprite.js"></script>
	<script src="$path/src/gameobjects/Text.js"></script>
	<script src="$path/src/gameobjects/BitmapText.js"></script>
	<script src="$path/src/gameobjects/Button.js"></script>
	<script src="$path/src/gameobjects/Graphics.js"></script>
	<script src="$path/src/gameobjects/RenderTexture.js"></script>

	<script src="$path/src/system/Canvas.js"></script>
	<script src="$path/src/system/StageScaleMode.js"></script>
	<script src="$path/src/system/Device.js"></script>
	<script src="$path/src/system/RequestAnimationFrame.js"></script>

	<script src="$path/src/math/RandomDataGenerator.js"></script>
	<script src="$path/src/math/Math.js"></script>
	<script src="$path/src/math/QuadTree.js"></script>

	<script src="$path/src/geom/Circle.js"></script>
	<script src="$path/src/geom/Point.js"></script>
	<script src="$path/src/geom/Rectangle.js"></script>

	<script src="$path/src/net/Net.js"></script>

	<script src="$path/src/tween/TweenManager.js"></script>
	<script src="$path/src/tween/Tween.js"></script>
	<script src="$path/src/tween/Easing.js"></script>

	<script src="$path/src/time/Time.js"></script>
	<script src="$path/src/time/Timer.js"></script>

	<script src="$path/src/animation/AnimationManager.js"></script>
	<script src="$path/src/animation/Animation.js"></script>
	<script src="$path/src/animation/Frame.js"></script>
	<script src="$path/src/animation/FrameData.js"></script>
	<script src="$path/src/animation/AnimationParser.js"></script>

	<script src="$path/src/loader/Cache.js"></script>
	<script src="$path/src/loader/Loader.js"></script>
	<script src="$path/src/loader/LoaderParser.js"></script>

	<script src="$path/src/sound/Sound.js"></script>
	<script src="$path/src/sound/SoundManager.js"></script>

	<script src="$path/src/utils/Debug.js"></script>
	<script src="$path/src/utils/Color.js"></script>

	<script src="$path/src/physics/arcade/ArcadePhysics.js"></script>
	<script src="$path/src/physics/arcade/Body.js"></script>

	<script src="$path/src/particles/Particles.js"></script>
	<script src="$path/src/particles/arcade/ArcadeParticles.js"></script>
	<script src="$path/src/particles/arcade/Emitter.js"></script>

	<script src="$path/src/tilemap/Tile.js"></script>
	<script src="$path/src/tilemap/Tilemap.js"></script>
	<script src="$path/src/tilemap/TilemapLayer.js"></script>
	<script src="$path/src/tilemap/TilemapParser.js"></script>
	<script src="$path/src/tilemap/Tileset.js"></script>
	
	<script src="$path/src/PixiPatch.js"></script>
EOL;
?>
