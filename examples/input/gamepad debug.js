var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {
    game.load.spritesheet('start-input-button', 'assets/buttons/gamepad-input-start.png', 168,70);
    game.load.image('reset-buttons','assets/buttons/gamepad-reset-buttons.png');
}

var startInputButton;
var resetButton;

var supportedText;
var activeText;
var gamepadCountText;

var pad1;
var pad1Text;
var pad2;
var pad2Text;
var pad3;
var pad3Text;
var pad4;
var pad4Text;

var activityPad1Text;
var activityPad2Text;
var activityPad3Text;
var activityPad4Text;
var activityGlobalText;

var pad1StateText;
var pad2StateText;
var pad3StateText;
var pad4StateText;

function create() {

    game.stage.backgroundColor = '#222222';
    startInputButton = game.add.button(625, 5, 'start-input-button', onStartInput, this, 0, 0, 0);
    resetButton = game.add.button(425, 5, 'reset-buttons', onResetButtons, this);

    pad1 = game.input.gamepad.pad1;
    pad2 = game.input.gamepad.pad2;
    pad3 = game.input.gamepad.pad3;
    pad4 = game.input.gamepad.pad4;

    setupText();
}

function onStartInput() {
    if(game.input.gamepad.active) {
        game.input.gamepad.stop();
        startInputButton.setFrames(0,0,0);
    } else {
        game.input.gamepad.start();
        startInputButton.setFrames(1,1,1);
    }
}

function onResetButtons() {
    game.input.gamepad.reset();
}

function update() {
    supportedText.setText('Gamepad supported in this browser: '+game.input.gamepad.supported);
    activeText.setText('Gamepad input active: '+game.input.gamepad.active);
    gamepadCountText.setText('Gamepads connected: '+game.input.gamepad.padsConnected);

    updatePadStatusText(pad1._rawPad, pad1Text, 1);
    updatePadStatusText(pad2._rawPad, pad2Text, 2);
    updatePadStatusText(pad3._rawPad, pad3Text, 3);
    updatePadStatusText(pad4._rawPad, pad4Text, 4);

    updatePadsButtonsAxes(pad1._rawPad, pad1StateText, 1);
    updatePadsButtonsAxes(pad2._rawPad, pad2StateText, 2);
    updatePadsButtonsAxes(pad3._rawPad, pad3StateText, 3);
    updatePadsButtonsAxes(pad4._rawPad, pad4StateText, 4);
}

function updatePadStatusText(rawPad, padText, num) {
    if(rawPad) {
        padText.setText('Pad '+num+': [ index: '+rawPad['index']+' | id: '+rawPad['id']
            +' | timestamp: '+rawPad['timestamp']+']'
            +' | buttons: '+rawPad.buttons.length
            +' | axes: '+rawPad.axes.length
        );
    } else {
        padText.setText('Pad '+num+': Not connected');
    }
}

function updatePadsButtonsAxes(rawPad, padStateText, num) {
    if(rawPad) {
        var txt = 'Pad '+num+' buttons/axes: \n';
        for (var i = 0; i < rawPad.buttons.length; i += 1) {
            txt += 'Button '+i+': '+rawPad.buttons[i]+'\n';
        }
        for (var i = 0; i < rawPad.axes.length; i += 1) {
            txt += 'Axis '+i+': '+rawPad.axes[i]+'\n';
        }
        padStateText.setText(txt);
    }
}

function setupText() {

    var style = { font: "12px Arial", fill: "#ffffff", align: "left" };
    var tinyStyle = { font: "10px Arial", fill: "#ffffff", align: "left" };
    supportedText = game.add.text(10, 10, 'Gamepad supported in this browser: '+game.input.gamepad.supported, style);
    activeText = game.add.text(10, 30, 'Gamepad input active: '+game.input.gamepad.active, style);
    gamepadCountText = game.add.text(10, 50, 'Gamepads connected: '+game.input.gamepad.padsConnected, style);
    pad1StateText = game.add.text(10, 300, 'Pad 1 buttons/axes: ', tinyStyle);
    pad2StateText = game.add.text(200, 300, 'Pad 2 buttons/axes: ', tinyStyle);
    pad3StateText = game.add.text(390, 300, 'Pad 3 buttons/axes: ', tinyStyle);
    pad4StateText = game.add.text(580, 300, 'Pad 4 buttons/axes: ', tinyStyle);

    // Setting up infotext and callbacks for all separate four gamepads

    pad1 = game.input.gamepad.pad1;
    pad1Text = game.add.text(10, 80, 'Pad 1: ', style);
    pad2 = game.input.gamepad.pad2;
    pad2Text = game.add.text(10, 100, 'Pad 2: ', style);
    pad3 = game.input.gamepad.pad3;
    pad3Text = game.add.text(10, 120, 'Pad 3: ', style);
    pad4 = game.input.gamepad.pad4;
    pad4Text = game.add.text(10, 140, 'Pad 4: ', style);

    activityPad1Text = game.add.text(10, 180, 'Last activity pad 1: ', style);
    addPadCallbacks(pad1, activityPad1Text, 1);

    activityPad2Text = game.add.text(10, 200, 'Last activity pad 2: ', style);
    addPadCallbacks(pad2, activityPad2Text, 2);

    activityPad3Text = game.add.text(10, 220, 'Last activity pad 3: ', style);
    addPadCallbacks(pad3, activityPad3Text, 3);

    activityPad4Text = game.add.text(10, 240, 'Last activity pad 4: ', style);
    addPadCallbacks(pad4, activityPad4Text, 4);

    activityGlobalText = game.add.text(10, 270, 'Last activity all pads: ', style);



    // Here we're setting callbacks that will trigger from ALL gamepads connected
    game.input.gamepad.addCallbacks(this, {
        onConnect: function(padIndex){
            activityGlobalText.setText('Last activity all pads: Connected with pad index '+padIndex);
        },
        onDisconnect: function(padIndex){
            activityGlobalText.setText('Last activity all pads: Disconnected with pad index '+padIndex);
        },
        onDown: function(buttonCode, value, padIndex){
            activityGlobalText.setText('Last activity all pads: Pad index '+padIndex+' buttonCode: '+buttonCode+' | value: '+value);
        },
        onUp: function(buttonCode, value, padIndex){
            activityGlobalText.setText('Last activity all pads: Pad index '+padIndex+' buttonCode: '+buttonCode+' | value: '+value);
        },
        onAxis: function(axisState, padIndex) {
            activityGlobalText.setText('Last activity all pads: Pad index '+padIndex+': axis '+axisState.axis+': '+axisState.value);
        },
        onFloat: function(buttonCode, value, padIndex) {
            activityGlobalText.setText('Last activity all pads: Pad index '+padIndex+' buttonCode: '+buttonCode+' | value (float): '+value);
        }
    });
}



function addPadCallbacks(pad, text, index) {
    pad.addCallbacks(this, {
        onConnect: function(){
            text.setText('Last activity pad '+index+': Connected');
        },
        onDisconnect: function(){
            text.setText('Last activity pad '+index+': Disconnected');
        },
        onDown: function(buttonCode, value){
            text.setText('Last activity pad '+index+': buttonCode: '+buttonCode+' | value: '+value);
        },
        onUp: function(buttonCode, value){
            text.setText('Last activity pad '+index+': buttonCode: '+buttonCode+' | value: '+value);
        },
        onAxis: function(axisState) {
            text.setText('Last activity pad '+index+': axis '+axisState.axis+': '+axisState.value);
        },
        onFloat: function(buttonCode, value) {
            text.setText('Last activity pad '+index+': buttonCode: '+buttonCode+' | value (float): '+value);
        }
    });
}