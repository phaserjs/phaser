var Event = require('../../../events/Event');

var KeyComboMatchEvent = function (keyCombo, keyboardEvent)
{
    Event.call(this, 'KEY_COMBO_MATCH_EVENT');

    this.target = keyCombo;

    this.data = keyboardEvent;
};

KeyComboMatchEvent.prototype = Object.create(Event.prototype);
KeyComboMatchEvent.prototype.constructor = KeyComboMatchEvent;

module.exports = KeyComboMatchEvent;
