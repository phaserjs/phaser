/// <reference path="../_definitions.ts" />
/**
* Phaser - Group
*
* This class is used for organising, updating and sorting game objects.
*/
var Phaser;
(function (Phaser) {
    var Group = (function () {
        function Group(game, maxSize) {
            if (typeof maxSize === "undefined") { maxSize = 0; }
            /**
            * Helper for sort.
            */
            this._sortIndex = '';
            /**
            * This keeps track of the z value of any game object added to this Group
            */
            this._zCounter = 0;
            /**
            * The unique Group ID
            */
            this.ID = -1;
            /**
            * The z value of this Group (within its parent Group, if any)
            */
            this.z = -1;
            /**
            * The Group this Group is a child of (if any).
            */
            this.group = null;
            /**
            * A bool representing if the Group has been modified in any way via a scale, rotate, flip or skew.
            */
            this.modified = false;
            this.game = game;
            this.type = Phaser.Types.GROUP;
            this.active = true;
            this.exists = true;
            this.visible = true;
            this.members = [];
            this.length = 0;
            this._maxSize = maxSize;
            this._marker = 0;
            this._sortIndex = null;
            this.ID = this.game.world.getNextGroupID();
            this.transform = new Phaser.Components.TransformManager(this);
            this.texture = new Phaser.Display.Texture(this);
            this.texture.opaque = false;
        }
        Group.prototype.getNextZIndex = /**
        * Gets the next z index value for children of this Group
        */
        function () {
            return this._zCounter++;
        };
        Group.prototype.destroy = /**
        * Override this function to handle any deleting or "shutdown" type operations you might need,
        * such as removing traditional children like Basic objects.
        */
        function () {
            if(this.members != null) {
                this._i = 0;
                while(this._i < this.length) {
                    this._member = this.members[this._i++];
                    if(this._member != null) {
                        this._member.destroy();
                    }
                }
                this.members.length = 0;
            }
            this._sortIndex = null;
        };
        Group.prototype.update = /**
        * Calls update on all members of this Group who have a status of active=true and exists=true
        * You can also call Object.update directly, which will bypass the active/exists check.
        */
        function () {
            if(this.modified == false && (!this.transform.scale.equals(1) || !this.transform.skew.equals(0) || this.transform.rotation != 0 || this.transform.rotationOffset != 0 || this.texture.flippedX || this.texture.flippedY)) {
                this.modified = true;
            }
            this._i = 0;
            while(this._i < this.length) {
                this._member = this.members[this._i++];
                if(this._member != null && this._member.exists && this._member.active) {
                    if(this._member.type != Phaser.Types.GROUP) {
                        this._member.preUpdate();
                    }
                    this._member.update();
                }
            }
        };
        Group.prototype.postUpdate = /**
        * Calls update on all members of this Group who have a status of active=true and exists=true
        * You can also call Object.postUpdate directly, which will bypass the active/exists check.
        */
        function () {
            if(this.modified == true && this.transform.scale.equals(1) && this.transform.skew.equals(0) && this.transform.rotation == 0 && this.transform.rotationOffset == 0 && this.texture.flippedX == false && this.texture.flippedY == false) {
                this.modified = false;
            }
            this._i = 0;
            while(this._i < this.length) {
                this._member = this.members[this._i++];
                if(this._member != null && this._member.exists && this._member.active) {
                    this._member.postUpdate();
                }
            }
        };
        Group.prototype.render = /**
        * Calls render on all members of this Group who have a status of visible=true and exists=true
        * You can also call Object.render directly, which will bypass the visible/exists check.
        */
        function (camera) {
            if(camera.isHidden(this) == true) {
                return;
            }
            this.game.renderer.groupRenderer.preRender(camera, this);
            this._i = 0;
            while(this._i < this.length) {
                this._member = this.members[this._i++];
                if(this._member != null && this._member.exists && this._member.visible && camera.isHidden(this._member) == false) {
                    if(this._member.type == Phaser.Types.GROUP) {
                        this._member.render(camera);
                    } else {
                        this.game.renderer.renderGameObject(camera, this._member);
                    }
                }
            }
            this.game.renderer.groupRenderer.postRender(camera, this);
        };
        Group.prototype.directRender = /**
        * Calls render on all members of this Group regardless of their visible status and also ignores the camera blacklist.
        * Use this when the Group objects render to hidden canvases for example.
        */
        function (camera) {
            this.game.renderer.groupRenderer.preRender(camera, this);
            this._i = 0;
            while(this._i < this.length) {
                this._member = this.members[this._i++];
                if(this._member != null && this._member.exists) {
                    if(this._member.type == Phaser.Types.GROUP) {
                        this._member.directRender(camera);
                    } else {
                        this.game.renderer.renderGameObject(this._member);
                    }
                }
            }
            this.game.renderer.groupRenderer.postRender(camera, this);
        };
        Object.defineProperty(Group.prototype, "maxSize", {
            get: /**
            * The maximum capacity of this group.  Default is 0, meaning no max capacity, and the group can just grow.
            */
            function () {
                return this._maxSize;
            },
            set: /**
            * @private
            */
            function (size) {
                this._maxSize = size;
                if(this._marker >= this._maxSize) {
                    this._marker = 0;
                }
                if(this._maxSize == 0 || this.members == null || (this._maxSize >= this.members.length)) {
                    return;
                }
                //If the max size has shrunk, we need to get rid of some objects
                this._i = this._maxSize;
                this._length = this.members.length;
                while(this._i < this._length) {
                    this._member = this.members[this._i++];
                    if(this._member != null) {
                        this._member.destroy();
                    }
                }
                this.length = this.members.length = this._maxSize;
            },
            enumerable: true,
            configurable: true
        });
        Group.prototype.add = /**
        * Adds a new Game Object to the group.
        * Group will try to replace a null member of the array first.
        * Failing that, Group will add it to the end of the member array,
        * assuming there is room for it, and doubling the size of the array if necessary.
        *
        * <p>WARNING: If the group has a maxSize that has already been met,
        * the object will NOT be added to the group!</p>
        *
        * @param {Basic} Object The object you want to add to the group.
        * @return {Basic} The same object that was passed in.
        */
        function (object) {
            //  Is this object already in another Group?
            //  You can't add a Group to itself or an object to the same Group twice
            if(object.group && (object.group.ID == this.ID || (object.type == Phaser.Types.GROUP && object.ID == this.ID))) {
                return object;
            }
            //  First, look for a null entry where we can add the object.
            this._i = 0;
            this._length = this.members.length;
            while(this._i < this._length) {
                if(this.members[this._i] == null) {
                    this.members[this._i] = object;
                    this.setObjectIDs(object);
                    if(this._i >= this.length) {
                        this.length = this._i + 1;
                    }
                    return object;
                }
                this._i++;
            }
            //  Failing that, expand the array (if we can) and add the object.
            if(this._maxSize > 0) {
                if(this.members.length >= this._maxSize) {
                    return object;
                } else if(this.members.length * 2 <= this._maxSize) {
                    this.members.length *= 2;
                } else {
                    this.members.length = this._maxSize;
                }
            } else {
                this.members.length *= 2;
            }
            //  If we made it this far, then we successfully grew the group,
            //  and we can go ahead and add the object at the first open slot.
            this.members[this._i] = object;
            this.length = this._i + 1;
            this.setObjectIDs(object);
            return object;
        };
        Group.prototype.addNewSprite = /**
        * Create a new Sprite within this Group at the specified position.
        *
        * @param x {number} X position of the new sprite.
        * @param y {number} Y position of the new sprite.
        * @param [key] {string} The image key as defined in the Game.Cache to use as the texture for this sprite
        * @param [frame] {string|number} If the sprite uses an image from a texture atlas or sprite sheet you can pass the frame here. Either a number for a frame ID or a string for a frame name.
        * @returns {Sprite} The newly created sprite object.
        */
        function (x, y, key, frame) {
            if (typeof key === "undefined") { key = ''; }
            if (typeof frame === "undefined") { frame = null; }
            return this.add(new Phaser.Sprite(this.game, x, y, key, frame));
        };
        Group.prototype.setObjectIDs = /**
        * Sets all of the game object properties needed to exist within this Group.
        */
        function (object, zIndex) {
            if (typeof zIndex === "undefined") { zIndex = -1; }
            //  If the object is already in another Group, inform that Group it has left
            if(object.group !== null) {
                object.group.remove(object);
            }
            object.group = this;
            if(zIndex == -1) {
                zIndex = this.getNextZIndex();
            }
            object.z = zIndex;
            if(object['events']) {
                object['events'].onAddedToGroup.dispatch(object, this, object.z);
            }
        };
        Group.prototype.recycle = /**
        * Recycling is designed to help you reuse game objects without always re-allocating or "newing" them.
        *
        * <p>If you specified a maximum size for this group (like in Emitter),
        * then recycle will employ what we're calling "rotating" recycling.
        * Recycle() will first check to see if the group is at capacity yet.
        * If group is not yet at capacity, recycle() returns a new object.
        * If the group IS at capacity, then recycle() just returns the next object in line.</p>
        *
        * <p>If you did NOT specify a maximum size for this group,
        * then recycle() will employ what we're calling "grow-style" recycling.
        * Recycle() will return either the first object with exists == false,
        * or, finding none, add a new object to the array,
        * doubling the size of the array if necessary.</p>
        *
        * <p>WARNING: If this function needs to create a new object,
        * and no object class was provided, it will return null
        * instead of a valid object!</p>
        *
        * @param {class} ObjectClass The class type you want to recycle (e.g. Basic, EvilRobot, etc). Do NOT "new" the class in the parameter!
        *
        * @return {any} A reference to the object that was created.  Don't forget to cast it back to the Class you want (e.g. myObject = myGroup.recycle(myObjectClass) as myObjectClass;).
        */
        function (objectClass) {
            if (typeof objectClass === "undefined") { objectClass = null; }
            if(this._maxSize > 0) {
                if(this.length < this._maxSize) {
                    if(objectClass == null) {
                        return null;
                    }
                    return this.add(new objectClass(this.game));
                } else {
                    this._member = this.members[this._marker++];
                    if(this._marker >= this._maxSize) {
                        this._marker = 0;
                    }
                    return this._member;
                }
            } else {
                this._member = this.getFirstAvailable(objectClass);
                if(this._member != null) {
                    return this._member;
                }
                if(objectClass == null) {
                    return null;
                }
                return this.add(new objectClass(this.game));
            }
        };
        Group.prototype.remove = /**
        * Removes an object from the group.
        *
        * @param {Basic} object The Game Object you want to remove.
        * @param {bool} splice Whether the object should be cut from the array entirely or not.
        *
        * @return {Basic} The removed object.
        */
        function (object, splice) {
            if (typeof splice === "undefined") { splice = false; }
            //console.log('removing from group: ', object.name);
            this._i = this.members.indexOf(object);
            if(this._i < 0 || (this._i >= this.members.length)) {
                return null;
            }
            if(splice) {
                this.members.splice(this._i, 1);
                this.length--;
            } else {
                this.members[this._i] = null;
            }
            //console.log('nulled');
            if(object['events']) {
                object['events'].onRemovedFromGroup.dispatch(object, this);
            }
            object.group = null;
            object.z = -1;
            return object;
        };
        Group.prototype.replace = /**
        * Replaces an existing game object in this Group with a new one.
        *
        * @param {Basic} oldObject	The object you want to replace.
        * @param {Basic} newObject	The new object you want to use instead.
        *
        * @return {Basic} The new object.
        */
        function (oldObject, newObject) {
            this._i = this.members.indexOf(oldObject);
            if(this._i < 0 || (this._i >= this.members.length)) {
                return null;
            }
            this.setObjectIDs(newObject, this.members[this._i].z);
            //  Null the old object
            this.remove(this.members[this._i]);
            this.members[this._i] = newObject;
            return newObject;
        };
        Group.prototype.swap = /**
        * Swaps two existing game object in this Group with each other.
        *
        * @param {Basic} child1 The first object to swap.
        * @param {Basic} child2 The second object to swap.
        *
        * @return {Basic} True if the two objects successfully swapped position.
        */
        function (child1, child2, sort) {
            if (typeof sort === "undefined") { sort = true; }
            if(child1.group.ID != this.ID || child2.group.ID != this.ID || child1 === child2) {
                return false;
            }
            var tempZ = child1.z;
            child1.z = child2.z;
            child2.z = tempZ;
            if(sort) {
                this.sort();
            }
            return true;
        };
        Group.prototype.bringToTop = function (child) {
            //console.log('bringToTop', child.name,'current z', child.z);
            var oldZ = child.z;
            //  If child not in this group, or is already at the top of the group, return false
            //if (!child || child.group == null || child.group.ID != this.ID || child.z == this._zCounter)
            if(!child || child.group == null || child.group.ID != this.ID) {
                //console.log('If child not in this group, or is already at the top of the group, return false');
                return false;
            }
            //  Find out the largest z index
            var topZ = -1;
            for(var i = 0; i < this.length; i++) {
                if(this.members[i] && this.members[i].z > topZ) {
                    topZ = this.members[i].z;
                }
            }
            //  Child is already at the top
            if(child.z == topZ) {
                return false;
            }
            child.z = topZ + 1;
            //  Sort them out based on the current z indexes
            this.sort();
            //  Now tidy-up the z indexes, removing gaps, etc
            for(var i = 0; i < this.length; i++) {
                if(this.members[i]) {
                    this.members[i].z = i;
                }
            }
            //console.log('bringToTop', child.name, 'old z', oldZ, 'new z', child.z);
            return true;
            //  What's the z index of the top most child?
            /*
            var childIndex: number = this._zCounter;
            
            console.log('childIndex', childIndex);
            
            this._i = 0;
            
            while (this._i < this.length)
            {
            this._member = this.members[this._i++];
            
            if (this._member)
            {
            if (this._i > childIndex)
            {
            this._member.z--;
            }
            else if (this._member.z == child.z)
            {
            childIndex = this._i;
            this._member.z = this._zCounter;
            }
            }
            }
            
            console.log('child inserted at index', child.z);
            
            //  Maybe redundant?
            this.sort();
            
            return true;
            */
                    };
        Group.prototype.sort = /**
        * Call this function to sort the group according to a particular value and order.
        * For example, to sort game objects for Zelda-style overlaps you might call
        * <code>myGroup.sort("y",Group.ASCENDING)</code> at the bottom of your
        * <code>State.update()</code> override.  To sort all existing objects after
        * a big explosion or bomb attack, you might call <code>myGroup.sort("exists",Group.DESCENDING)</code>.
        *
        * @param {string} index The <code>string</code> name of the member variable you want to sort on.  Default value is "z".
        * @param {number} order A <code>Group</code> constant that defines the sort order.  Possible values are <code>Group.ASCENDING</code> and <code>Group.DESCENDING</code>.  Default value is <code>Group.ASCENDING</code>.
        */
        function (index, order) {
            if (typeof index === "undefined") { index = 'z'; }
            if (typeof order === "undefined") { order = Phaser.Types.SORT_ASCENDING; }
            var _this = this;
            this._sortIndex = index;
            this._sortOrder = order;
            this.members.sort(function (a, b) {
                return _this.sortHandler(a, b);
            });
        };
        Group.prototype.sortHandler = /**
        * Helper function for the sort process.
        *
        * @param {Basic} Obj1 The first object being sorted.
        * @param {Basic} Obj2 The second object being sorted.
        *
        * @return {number} An integer value: -1 (Obj1 before Obj2), 0 (same), or 1 (Obj1 after Obj2).
        */
        function (obj1, obj2) {
            if(!obj1 || !obj2) {
                //console.log('null objects in sort', obj1, obj2);
                return 0;
            }
            if(obj1[this._sortIndex] < obj2[this._sortIndex]) {
                return this._sortOrder;
            } else if(obj1[this._sortIndex] > obj2[this._sortIndex]) {
                return -this._sortOrder;
            }
            return 0;
        };
        Group.prototype.setAll = /**
        * Go through and set the specified variable to the specified value on all members of the group.
        *
        * @param {string} VariableName	The string representation of the variable name you want to modify, for example "visible" or "scrollFactor".
        * @param {Object} Value The value you want to assign to that variable.
        * @param {bool} Recurse	Default value is true, meaning if <code>setAll()</code> encounters a member that is a group, it will call <code>setAll()</code> on that group rather than modifying its variable.
        */
        function (variableName, value, recurse) {
            if (typeof recurse === "undefined") { recurse = true; }
            this._i = 0;
            while(this._i < this.length) {
                this._member = this.members[this._i++];
                if(this._member != null) {
                    if(recurse && this._member.type == Phaser.Types.GROUP) {
                        this._member.setAll(variableName, value, recurse);
                    } else {
                        this._member[variableName] = value;
                    }
                }
            }
        };
        Group.prototype.callAll = /**
        * Go through and call the specified function on all members of the group.
        * Currently only works on functions that have no required parameters.
        *
        * @param {string} FunctionName	The string representation of the function you want to call on each object, for example "kill()" or "init()".
        * @param {bool} Recurse	Default value is true, meaning if <code>callAll()</code> encounters a member that is a group, it will call <code>callAll()</code> on that group rather than calling the group's function.
        */
        function (functionName, recurse) {
            if (typeof recurse === "undefined") { recurse = true; }
            this._i = 0;
            while(this._i < this.length) {
                this._member = this.members[this._i++];
                if(this._member != null) {
                    if(recurse && this._member.type == Phaser.Types.GROUP) {
                        this._member.callAll(functionName, recurse);
                    } else {
                        this._member[functionName]();
                    }
                }
            }
        };
        Group.prototype.forEach = /**
        * @param {function} callback
        * @param {bool} recursive
        */
        function (callback, recursive) {
            if (typeof recursive === "undefined") { recursive = false; }
            this._i = 0;
            while(this._i < this.length) {
                this._member = this.members[this._i++];
                if(this._member != null) {
                    if(recursive && this._member.type == Phaser.Types.GROUP) {
                        this._member.forEach(callback, true);
                    } else {
                        callback.call(this, this._member);
                    }
                }
            }
        };
        Group.prototype.forEachAlive = /**
        * @param {any} context
        * @param {function} callback
        * @param {bool} recursive
        */
        function (context, callback, recursive) {
            if (typeof recursive === "undefined") { recursive = false; }
            this._i = 0;
            while(this._i < this.length) {
                this._member = this.members[this._i++];
                if(this._member != null && this._member.alive) {
                    if(recursive && this._member.type == Phaser.Types.GROUP) {
                        this._member.forEachAlive(context, callback, true);
                    } else {
                        callback.call(context, this._member);
                    }
                }
            }
        };
        Group.prototype.getFirstAvailable = /**
        * Call this function to retrieve the first object with exists == false in the group.
        * This is handy for recycling in general, e.g. respawning enemies.
        *
        * @param {any} [ObjectClass] An optional parameter that lets you narrow the results to instances of this particular class.
        *
        * @return {any} A <code>Basic</code> currently flagged as not existing.
        */
        function (objectClass) {
            if (typeof objectClass === "undefined") { objectClass = null; }
            this._i = 0;
            while(this._i < this.length) {
                this._member = this.members[this._i++];
                if((this._member != null) && !this._member.exists && ((objectClass == null) || (typeof this._member === objectClass))) {
                    return this._member;
                }
            }
            return null;
        };
        Group.prototype.getFirstNull = /**
        * Call this function to retrieve the first index set to 'null'.
        * Returns -1 if no index stores a null object.
        *
        * @return {number} An <code>int</code> indicating the first null slot in the group.
        */
        function () {
            this._i = 0;
            while(this._i < this.length) {
                if(this.members[this._i] == null) {
                    return this._i;
                } else {
                    this._i++;
                }
            }
            return -1;
        };
        Group.prototype.getFirstExtant = /**
        * Call this function to retrieve the first object with exists == true in the group.
        * This is handy for checking if everything's wiped out, or choosing a squad leader, etc.
        *
        * @return {Basic} A <code>Basic</code> currently flagged as existing.
        */
        function () {
            this._i = 0;
            while(this._i < this.length) {
                this._member = this.members[this._i++];
                if(this._member != null && this._member.exists) {
                    return this._member;
                }
            }
            return null;
        };
        Group.prototype.getFirstAlive = /**
        * Call this function to retrieve the first object with dead == false in the group.
        * This is handy for checking if everything's wiped out, or choosing a squad leader, etc.
        *
        * @return {Basic} A <code>Basic</code> currently flagged as not dead.
        */
        function () {
            this._i = 0;
            while(this._i < this.length) {
                this._member = this.members[this._i++];
                if((this._member != null) && this._member.exists && this._member.alive) {
                    return this._member;
                }
            }
            return null;
        };
        Group.prototype.getFirstDead = /**
        * Call this function to retrieve the first object with dead == true in the group.
        * This is handy for checking if everything's wiped out, or choosing a squad leader, etc.
        *
        * @return {Basic} A <code>Basic</code> currently flagged as dead.
        */
        function () {
            this._i = 0;
            while(this._i < this.length) {
                this._member = this.members[this._i++];
                if((this._member != null) && !this._member.alive) {
                    return this._member;
                }
            }
            return null;
        };
        Group.prototype.countLiving = /**
        * Call this function to find out how many members of the group are not dead.
        *
        * @return {number} The number of <code>Basic</code>s flagged as not dead.  Returns -1 if group is empty.
        */
        function () {
            this._count = -1;
            this._i = 0;
            while(this._i < this.length) {
                this._member = this.members[this._i++];
                if(this._member != null) {
                    if(this._count < 0) {
                        this._count = 0;
                    }
                    if(this._member.exists && this._member.alive) {
                        this._count++;
                    }
                }
            }
            return this._count;
        };
        Group.prototype.countDead = /**
        * Call this function to find out how many members of the group are dead.
        *
        * @return {number} The number of <code>Basic</code>s flagged as dead.  Returns -1 if group is empty.
        */
        function () {
            this._count = -1;
            this._i = 0;
            while(this._i < this.length) {
                this._member = this.members[this._i++];
                if(this._member != null) {
                    if(this._count < 0) {
                        this._count = 0;
                    }
                    if(!this._member.alive) {
                        this._count++;
                    }
                }
            }
            return this._count;
        };
        Group.prototype.getRandom = /**
        * Returns a member at random from the group.
        *
        * @param {number} StartIndex Optional offset off the front of the array. Default value is 0, or the beginning of the array.
        * @param {number} Length Optional restriction on the number of values you want to randomly select from.
        *
        * @return {Basic} A <code>Basic</code> from the members list.
        */
        function (startIndex, length) {
            if (typeof startIndex === "undefined") { startIndex = 0; }
            if (typeof length === "undefined") { length = 0; }
            if(length == 0) {
                length = this.length;
            }
            return this.game.math.getRandom(this.members, startIndex, length);
        };
        Group.prototype.clear = /**
        * Remove all instances of <code>Basic</code> subclass (Basic, Block, etc) from the list.
        * WARNING: does not destroy() or kill() any of these objects!
        */
        function () {
            this.length = this.members.length = 0;
        };
        Group.prototype.kill = /**
        * Calls kill on the group's members and then on the group itself.
        */
        function () {
            this._i = 0;
            while(this._i < this.length) {
                this._member = this.members[this._i++];
                if((this._member != null) && this._member.exists) {
                    this._member.kill();
                }
            }
        };
        return Group;
    })();
    Phaser.Group = Group;    
})(Phaser || (Phaser = {}));
