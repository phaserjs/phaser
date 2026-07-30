var Enable = require('../../../../src/physics/arcade/components/Enable');

function createGameObject()
{
    var go = {
        active: false,
        visible: false
    };

    var body = {
        enable: false,
        gameObject: go,
        directControlCalled: false,
        directControlValue: undefined,
        resetCalled: false,
        resetX: undefined,
        resetY: undefined,
        stopCalled: false,
        updateFromGameObjectCalled: false,
        setDirectControl: function (value)
        {
            this.directControlCalled = true;
            this.directControlValue = value;
        },
        reset: function (x, y)
        {
            this.resetCalled = true;
            this.resetX = x;
            this.resetY = y;
        },
        stop: function ()
        {
            this.stopCalled = true;
        },
        updateFromGameObject: function ()
        {
            this.updateFromGameObjectCalled = true;
        }
    };

    var obj = Object.assign({}, Enable, { body: body });

    return obj;
}

describe('Enable', function ()
{
    describe('setDirectControl', function ()
    {
        it('should call body.setDirectControl with true by default', function ()
        {
            var obj = createGameObject();
            obj.setDirectControl(true);
            expect(obj.body.directControlCalled).toBe(true);
            expect(obj.body.directControlValue).toBe(true);
        });

        it('should call body.setDirectControl with false', function ()
        {
            var obj = createGameObject();
            obj.setDirectControl(false);
            expect(obj.body.directControlCalled).toBe(true);
            expect(obj.body.directControlValue).toBe(false);
        });

        it('should return the game object for chaining', function ()
        {
            var obj = createGameObject();
            var result = obj.setDirectControl(true);
            expect(result).toBe(obj);
        });
    });

    describe('enableBody', function ()
    {
        it('should set body.enable to true', function ()
        {
            var obj = createGameObject();
            obj.enableBody();
            expect(obj.body.enable).toBe(true);
        });

        it('should not call body.reset when reset is false', function ()
        {
            var obj = createGameObject();
            obj.enableBody(false, 100, 200);
            expect(obj.body.resetCalled).toBe(false);
        });

        it('should call body.reset with x and y when reset is true', function ()
        {
            var obj = createGameObject();
            obj.enableBody(true, 100, 200);
            expect(obj.body.resetCalled).toBe(true);
            expect(obj.body.resetX).toBe(100);
            expect(obj.body.resetY).toBe(200);
        });

        it('should not set gameObject.active when enableGameObject is false', function ()
        {
            var obj = createGameObject();
            obj.body.gameObject.active = false;
            obj.enableBody(false, 0, 0, false);
            expect(obj.body.gameObject.active).toBe(false);
        });

        it('should set gameObject.active to true when enableGameObject is true', function ()
        {
            var obj = createGameObject();
            obj.body.gameObject.active = false;
            obj.enableBody(false, 0, 0, true);
            expect(obj.body.gameObject.active).toBe(true);
        });

        it('should not set gameObject.visible when showGameObject is false', function ()
        {
            var obj = createGameObject();
            obj.body.gameObject.visible = false;
            obj.enableBody(false, 0, 0, false, false);
            expect(obj.body.gameObject.visible).toBe(false);
        });

        it('should set gameObject.visible to true when showGameObject is true', function ()
        {
            var obj = createGameObject();
            obj.body.gameObject.visible = false;
            obj.enableBody(false, 0, 0, false, true);
            expect(obj.body.gameObject.visible).toBe(true);
        });

        it('should reset body and set active and visible when all flags are true', function ()
        {
            var obj = createGameObject();
            obj.enableBody(true, 50, 75, true, true);
            expect(obj.body.enable).toBe(true);
            expect(obj.body.resetCalled).toBe(true);
            expect(obj.body.resetX).toBe(50);
            expect(obj.body.resetY).toBe(75);
            expect(obj.body.gameObject.active).toBe(true);
            expect(obj.body.gameObject.visible).toBe(true);
        });

        it('should return the game object for chaining', function ()
        {
            var obj = createGameObject();
            var result = obj.enableBody();
            expect(result).toBe(obj);
        });
    });

    describe('disableBody', function ()
    {
        it('should call body.stop', function ()
        {
            var obj = createGameObject();
            obj.disableBody();
            expect(obj.body.stopCalled).toBe(true);
        });

        it('should set body.enable to false', function ()
        {
            var obj = createGameObject();
            obj.body.enable = true;
            obj.disableBody();
            expect(obj.body.enable).toBe(false);
        });

        it('should not set gameObject.active when disableGameObject defaults to false', function ()
        {
            var obj = createGameObject();
            obj.body.gameObject.active = true;
            obj.disableBody();
            expect(obj.body.gameObject.active).toBe(true);
        });

        it('should set gameObject.active to false when disableGameObject is true', function ()
        {
            var obj = createGameObject();
            obj.body.gameObject.active = true;
            obj.disableBody(true);
            expect(obj.body.gameObject.active).toBe(false);
        });

        it('should not set gameObject.visible when hideGameObject defaults to false', function ()
        {
            var obj = createGameObject();
            obj.body.gameObject.visible = true;
            obj.disableBody();
            expect(obj.body.gameObject.visible).toBe(true);
        });

        it('should set gameObject.visible to false when hideGameObject is true', function ()
        {
            var obj = createGameObject();
            obj.body.gameObject.visible = true;
            obj.disableBody(false, true);
            expect(obj.body.gameObject.visible).toBe(false);
        });

        it('should disable active and visible when both flags are true', function ()
        {
            var obj = createGameObject();
            obj.body.gameObject.active = true;
            obj.body.gameObject.visible = true;
            obj.disableBody(true, true);
            expect(obj.body.gameObject.active).toBe(false);
            expect(obj.body.gameObject.visible).toBe(false);
        });

        it('should return the game object for chaining', function ()
        {
            var obj = createGameObject();
            var result = obj.disableBody();
            expect(result).toBe(obj);
        });
    });

    describe('refreshBody', function ()
    {
        it('should call body.updateFromGameObject', function ()
        {
            var obj = createGameObject();
            obj.refreshBody();
            expect(obj.body.updateFromGameObjectCalled).toBe(true);
        });

        it('should return the game object for chaining', function ()
        {
            var obj = createGameObject();
            var result = obj.refreshBody();
            expect(result).toBe(obj);
        });
    });

    describe('method chaining', function ()
    {
        it('should support chaining enableBody and disableBody', function ()
        {
            var obj = createGameObject();
            var result = obj.enableBody().disableBody();
            expect(result).toBe(obj);
            expect(obj.body.enable).toBe(false);
        });

        it('should support chaining setDirectControl and refreshBody', function ()
        {
            var obj = createGameObject();
            var result = obj.setDirectControl(true).refreshBody();
            expect(result).toBe(obj);
            expect(obj.body.directControlValue).toBe(true);
            expect(obj.body.updateFromGameObjectCalled).toBe(true);
        });
    });
});
