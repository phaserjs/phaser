var logger = require('jsdoc/util/logger');

exports.handlers = {

    /*
        From:

      "returns": [
        {
          "type": {
            "names": [
              "this"
            ],
            "parsedType": {
              "type": "NameExpression",
              "name": "this",
              "reservedWord": true
            }
          },
          "description": "This Game Object instance."
        }
      ],

        To:

      "returns": [
        {
          "type": {
            "names": [
              "Phaser.GameObjects.GameObject"
            ],
            "parsedType": {
              "type": "NameExpression",
              "name": "Phaser.GameObjects.GameObject"
            }
          },
          "description": "This Game Object instance."
        }
      ],

    */

    // The processingComplete event is fired after JSDoc updates the parse results to reflect inherited and borrowed symbols.
    processingComplete: function (e)
    {
        var count = 0;

        e.doclets.forEach(function(doclet) {

            if (Array.isArray(doclet.returns))
            {
                var entry = doclet.returns[0];

                if (entry.type.names[0] === 'this')
                {
                    count++;
                    entry.type.names[0] = doclet.memberof;
                }

                if (entry.type.parsedType && entry.type.parsedType.name === 'this')
                {
                    entry.type.parsedType.name = doclet.memberof;
                    entry.type.parsedType.reservedWord = false;
                }
            }

        });

        // logger.warn('converted ' + count);
    }
};