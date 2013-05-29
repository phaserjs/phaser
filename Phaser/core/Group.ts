/// <reference path="../Game.ts" />
/// <reference path="../Statics.ts" />

/**
* Phaser - Group
*
* This class is used for organising, updating and sorting game objects.
*/

module Phaser {

    export class Group {

        constructor(game: Game, maxSize?: number = 0) {

            this.game = game;
            this.type = Phaser.Types.GROUP;
            this.exists = true;
            this.visible = true;

            this.members = [];
            this.length = 0;

            this._maxSize = maxSize;
            this._marker = 0;
            this._sortIndex = null;

            this.cameraBlacklist = [];

        }

        /**
         * Internal tracker for the maximum capacity of the group.
         * Default is 0, or no max capacity.
         */
        private _maxSize: number;

        /**
         * Internal helper variable for recycling objects a la <code>Emitter</code>.
         */
        private _marker: number;

        /**
         * Helper for sort.
         */
        private _sortIndex: string;

        /**
         * Helper for sort.
         */
        private _sortOrder: number;

        /**
         * Temp vars to help avoid gc spikes
         */
        private _member;
        private _length: number;
        private _i: number;
        private _prevAlpha: number;
        private _count: number;

        /**
         * Reference to the main game object
         */
        public game: Game;

        /**
         * The type of game object.
         */
        public type: number;

        /**
         * If this Group exists or not. Can be set to false to skip certain loop checks.
         */
        public exists: bool;

        /**
         * Controls if this Group (and all of its contents) are rendered or skipped during the core game loop.
         */
        public visible: bool;

        /**
         * Use with <code>sort()</code> to sort in ascending order.
         */
        public static ASCENDING: number = -1;

        /**
         * Use with <code>sort()</code> to sort in descending order.
         */
        public static DESCENDING: number = 1;

        /**
         * Array of all the objects that exist in this group.
         */
        public members;

        /**
         * The number of entries in the members array.
         * For performance and safety you should check this variable
         * instead of members.length unless you really know what you're doing!
         */
        public length: number;

        /**
         * You can set a globalCompositeOperation that will be applied before the render method is called on this Groups children.
         * This is useful if you wish to apply an effect like 'lighten' to a whole group of children as it saves doing it one-by-one.
         * If this value is set it will call a canvas context save and restore before and after the render pass.
         * Set to null to disable.
         */
        public globalCompositeOperation: string = null;

        /**
         * You can set an alpha value on this Group that will be applied before the render method is called on this Groups children.
         * This is useful if you wish to alpha a whole group of children as it saves doing it one-by-one.
         * Set to 0 to disable.
         */
        public alpha: number = 0;

        /**
         * An Array of Cameras to which this Group, or any of its children, won't render
         * @type {Array}
         */
        public cameraBlacklist: number[];

        /**
         * Override this function to handle any deleting or "shutdown" type operations you might need,
         * such as removing traditional Flash children like Basic objects.
         */
        public destroy() {

            if (this.members != null)
            {
                this._i = 0;

                while (this._i < this.length)
                {
                    this._member = this.members[this._i++];

                    if (this._member != null)
                    {
                        this._member.destroy();
                    }
                }

                this.members.length = 0;
            }

            this._sortIndex = null;

        }

        /**
        * Calls update on all members of this Group who have a status of active=true and exists=true
        * You can also call Object.update directly, which will bypass the active/exists check.
        */
        public update(forceUpdate?: bool = false) {

            this._i = 0;

            while (this._i < this.length)
            {
                this._member = this.members[this._i++];

                if (this._member != null && this._member.exists && this._member.active)
                {
                    this._member.preUpdate();
                    this._member.update(forceUpdate);
                    this._member.postUpdate();
                }
            }
        }

        /**
        * Calls render on all members of this Group who have a status of visible=true and exists=true
        * You can also call Object.render directly, which will bypass the visible/exists check.
        */
        public render(renderer:IRenderer, camera: Camera) {

            if (camera.isHidden(this) == true)
            {
                return;
            }

            if (this.globalCompositeOperation)
            {
                this.game.stage.context.save();
                this.game.stage.context.globalCompositeOperation = this.globalCompositeOperation;
            }

            if (this.alpha > 0)
            {
                this._prevAlpha = this.game.stage.context.globalAlpha;
                this.game.stage.context.globalAlpha = this.alpha;
            }

            this._i = 0;

            while (this._i < this.length)
            {
                this._member = this.members[this._i++];

                if (this._member != null && this._member.exists && this._member.visible && camera.isHidden(this._member) == false)
                {
                    this._member.render.call(renderer, camera, this._member);
                }
            }

            if (this.alpha > 0)
            {
                this.game.stage.context.globalAlpha = this._prevAlpha;
            }

            if (this.globalCompositeOperation)
            {
                this.game.stage.context.restore();
            }
        }

        /**
         * The maximum capacity of this group.  Default is 0, meaning no max capacity, and the group can just grow.
         */
        public get maxSize(): number {
            return this._maxSize;
        }

        /**
         * @private
         */
        public set maxSize(Size: number) {

            this._maxSize = Size;

            if (this._marker >= this._maxSize)
            {
                this._marker = 0;
            }

            if (this._maxSize == 0 || this.members == null || (this._maxSize >= this.members.length))
            {
                return;
            }

            //If the max size has shrunk, we need to get rid of some objects
            this._i = this._maxSize;
            this._length = this.members.length;

            while (this._i < this._length)
            {
                this._member = this.members[this._i++];

                if (this._member != null)
                {
                    this._member.destroy();
                }
            }

            this.length = this.members.length = this._maxSize;
        }

        /**
         * Adds a new <code>Basic</code> subclass (Basic, GameObject, Sprite, etc) to the group.
         * Group will try to replace a null member of the array first.
         * Failing that, Group will add it to the end of the member array,
         * assuming there is room for it, and doubling the size of the array if necessary.
         *
         * <p>WARNING: If the group has a maxSize that has already been met,
         * the object will NOT be added to the group!</p>
         *
         * @param {Basic} Object The object you want to add to the group.
         * @return {Basic} The same <code>Basic</code> object that was passed in.
         */
        public add(object): any {

            //Don't bother adding an object twice.
            if (this.members.indexOf(Object) >= 0)
            {
                return object;
            }

            //First, look for a null entry where we can add the object.
            this._i = 0;
            this._length = this.members.length;

            while (this._i < this._length)
            {
                if (this.members[this._i] == null)
                {
                    this.members[this._i] = object;

                    if (this._i >= this.length)
                    {
                        this.length = this._i + 1;
                    }

                    return object;
                }

                this._i++;
            }

            //Failing that, expand the array (if we can) and add the object.
            if (this._maxSize > 0)
            {
                if (this.members.length >= this._maxSize)
                {
                    return object;
                }
                else if (this.members.length * 2 <= this._maxSize)
                {
                    this.members.length *= 2;
                }
                else
                {
                    this.members.length = this._maxSize;
                }
            }
            else
            {
                this.members.length *= 2;
            }

            //If we made it this far, then we successfully grew the group,
            //and we can go ahead and add the object at the first open slot.
            this.members[this._i] = object;
            this.length = this._i + 1;

            return object;

        }

        /**
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
        public recycle(objectClass = null) {

            if (this._maxSize > 0)
            {
                if (this.length < this._maxSize)
                {
                    if (objectClass == null)
                    {
                        return null;
                    }

                    return this.add(new objectClass(this.game));
                }
                else
                {
                    this._member = this.members[this._marker++];

                    if (this._marker >= this._maxSize)
                    {
                        this._marker = 0;
                    }

                    return this._member;
                }
            }
            else
            {
                this._member = this.getFirstAvailable(objectClass);

                if (this._member != null)
                {
                    return this._member;
                }

                if (objectClass == null)
                {
                    return null;
                }

                return this.add(new objectClass(this.game));
            }
        }

        /**
         * Removes an object from the group.
         *
         * @param {Basic} object The <code>Basic</code> you want to remove.
         * @param {boolean} splice Whether the object should be cut from the array entirely or not.
         *
         * @return {Basic} The removed object.
         */
        public remove(object, splice: bool = false) {

            this._i = this.members.indexOf(object);

            if (this._i < 0 || (this._i >= this.members.length))
            {
                return null;
            }

            if (splice)
            {
                this.members.splice(this._i, 1);
                this.length--;
            }
            else
            {
                this.members[this._i] = null;
            }

            return object;

        }

        /**
         * Replaces an existing <code>Basic</code> with a new one.
         *
         * @param {Basic} oldObject	The object you want to replace.
         * @param {Basic} newObject	The new object you want to use instead.
         *
         * @return {Basic} The new object.
         */
        public replace(oldObject, newObject) {

            this._i = this.members.indexOf(oldObject);

            if (this._i < 0 || (this._i >= this.members.length))
            {
                return null;
            }

            this.members[this._i] = newObject;

            return newObject;

        }

        /**
         * Call this function to sort the group according to a particular value and order.
         * For example, to sort game objects for Zelda-style overlaps you might call
         * <code>myGroup.sort("y",Group.ASCENDING)</code> at the bottom of your
         * <code>State.update()</code> override.  To sort all existing objects after
         * a big explosion or bomb attack, you might call <code>myGroup.sort("exists",Group.DESCENDING)</code>.
         *
         * @param {string} index The <code>string</code> name of the member variable you want to sort on.  Default value is "y".
         * @param {number} order A <code>Group</code> constant that defines the sort order.  Possible values are <code>Group.ASCENDING</code> and <code>Group.DESCENDING</code>.  Default value is <code>Group.ASCENDING</code>.
         */
        public sort(index: string = "y", order: number = Group.ASCENDING) {

            this._sortIndex = index;
            this._sortOrder = order;
            this.members.sort(this.sortHandler);

        }

        /**
         * Go through and set the specified variable to the specified value on all members of the group.
         *
         * @param {string} VariableName	The string representation of the variable name you want to modify, for example "visible" or "scrollFactor".
         * @param {Object} Value The value you want to assign to that variable.
         * @param {boolean} Recurse	Default value is true, meaning if <code>setAll()</code> encounters a member that is a group, it will call <code>setAll()</code> on that group rather than modifying its variable.
         */
        public setAll(variableName: string, value: Object, recurse: bool = true) {

            this._i = 0;

            while (this._i < this.length)
            {
                this._member = this.members[this._i++];

                if (this._member != null)
                {
                    if (recurse && this._member.type == Phaser.Types.GROUP)
                    {
                        this._member.setAll(variableName, value, recurse);
                    }
                    else
                    {
                        this._member[variableName] = value;
                    }
                }
            }
        }

        /**
         * Go through and call the specified function on all members of the group.
         * Currently only works on functions that have no required parameters.
         *
         * @param {string} FunctionName	The string representation of the function you want to call on each object, for example "kill()" or "init()".
         * @param {boolean} Recurse	Default value is true, meaning if <code>callAll()</code> encounters a member that is a group, it will call <code>callAll()</code> on that group rather than calling the group's function.
         */
        public callAll(functionName: string, recurse: bool = true) {

            this._i = 0;

            while (this._i < this.length)
            {
                this._member = this.members[this._i++];

                if (this._member != null)
                {
                    if (recurse && this._member.type == Phaser.Types.GROUP)
                    {
                        this._member.callAll(functionName, recurse);
                    }
                    else
                    {
                        this._member[functionName]();
                    }
                }
            }
        }

        /**
         * @param {function} callback
         * @param {boolean} recursive
         */
        public forEach(callback, recursive: bool = false) {

            this._i = 0;

            while (this._i < this.length)
            {
                this._member = this.members[this._i++];

                if (this._member != null)
                {
                    if (recursive && this._member.type == Phaser.Types.GROUP)
                    {
                        this._member.forEach(callback, true);
                    }
                    else
                    {
                        callback.call(this, this._member);
                    }
                }
            }

        }

        /**
         * @param {any} context
         * @param {function} callback
         * @param {boolean} recursive
         */
        public forEachAlive(context, callback, recursive: bool = false) {

            this._i = 0;

            while (this._i < this.length)
            {
                this._member = this.members[this._i++];

                if (this._member != null && this._member.alive)
                {
                    if (recursive && this._member.type == Phaser.Types.GROUP)
                    {
                        this._member.forEachAlive(context, callback, true);
                    }
                    else
                    {
                        callback.call(context, this._member);
                    }
                }
            }

        }

        /**
         * Call this function to retrieve the first object with exists == false in the group.
         * This is handy for recycling in general, e.g. respawning enemies.
         *
         * @param {any} [ObjectClass] An optional parameter that lets you narrow the results to instances of this particular class.
         *
         * @return {any} A <code>Basic</code> currently flagged as not existing.
         */
        public getFirstAvailable(objectClass = null) {

            this._i = 0;

            while (this._i < this.length)
            {
                this._member = this.members[this._i++];

                if ((this._member != null) && !this._member.exists && ((objectClass == null) || (typeof this._member === objectClass)))
                {
                    return this._member;
                }

            }

            return null;
        }

        /**
         * Call this function to retrieve the first index set to 'null'.
         * Returns -1 if no index stores a null object.
         *
         * @return {number} An <code>int</code> indicating the first null slot in the group.
         */
        public getFirstNull(): number {

            this._i = 0;

            while (this._i < this.length)
            {
                if (this.members[this._i] == null)
                {
                    return this._i;
                }
                else
                {
                    this._i++;
                }
            }

            return -1;

        }

        /**
         * Call this function to retrieve the first object with exists == true in the group.
         * This is handy for checking if everything's wiped out, or choosing a squad leader, etc.
         *
         * @return {Basic} A <code>Basic</code> currently flagged as existing.
         */
        public getFirstExtant() {

            this._i = 0;

            while (this._i < this.length)
            {
                this._member = this.members[this._i++];

                if (this._member != null && this._member.exists)
                {
                    return this._member;
                }
            }

            return null;

        }

        /**
         * Call this function to retrieve the first object with dead == false in the group.
         * This is handy for checking if everything's wiped out, or choosing a squad leader, etc.
         *
         * @return {Basic} A <code>Basic</code> currently flagged as not dead.
         */
        public getFirstAlive() {

            this._i = 0;

            while (this._i < this.length)
            {
                this._member = this.members[this._i++];

                if ((this._member != null) && this._member.exists && this._member.alive)
                {
                    return this._member;
                }
            }

            return null;

        }

        /**
         * Call this function to retrieve the first object with dead == true in the group.
         * This is handy for checking if everything's wiped out, or choosing a squad leader, etc.
         *
         * @return {Basic} A <code>Basic</code> currently flagged as dead.
         */
        public getFirstDead() {

            this._i = 0;

            while (this._i < this.length)
            {
                this._member = this.members[this._i++];

                if ((this._member != null) && !this._member.alive)
                {
                    return this._member;
                }
            }

            return null;

        }

        /**
         * Call this function to find out how many members of the group are not dead.
         *
         * @return {number} The number of <code>Basic</code>s flagged as not dead.  Returns -1 if group is empty.
         */
        public countLiving(): number {

            this._count = -1;
            this._i = 0;

            while (this._i < this.length)
            {
                this._member = this.members[this._i++];

                if (this._member != null)
                {
                    if (this._count < 0)
                    {
                        this._count = 0;
                    }

                    if (this._member.exists && this._member.alive)
                    {
                        this._count++;
                    }
                }
            }

            return this._count;

        }

        /**
         * Call this function to find out how many members of the group are dead.
         *
         * @return {number} The number of <code>Basic</code>s flagged as dead.  Returns -1 if group is empty.
         */
        public countDead(): number {

            this._count = -1;
            this._i = 0;

            while (this._i < this.length)
            {
                this._member = this.members[this._i++];

                if (this._member != null)
                {
                    if (this._count < 0)
                    {
                        this._count = 0;
                    }

                    if (!this._member.alive)
                    {
                        this._count++;
                    }
                }
            }

            return this._count;

        }

        /**
         * Returns a member at random from the group.
         *
         * @param {number} StartIndex Optional offset off the front of the array. Default value is 0, or the beginning of the array.
         * @param {number} Length Optional restriction on the number of values you want to randomly select from.
         *
         * @return {Basic} A <code>Basic</code> from the members list.
         */
        public getRandom(startIndex: number = 0, length: number = 0) {

            if (length == 0)
            {
                length = this.length;
            }

            return this.game.math.getRandom(this.members, startIndex, length);

        }

        /**
         * Remove all instances of <code>Basic</code> subclass (Basic, Block, etc) from the list.
         * WARNING: does not destroy() or kill() any of these objects!
         */
        public clear() {
            this.length = this.members.length = 0;
        }

        /**
         * Calls kill on the group's members and then on the group itself.
         */
        public kill() {

            this._i = 0;

            while (this._i < this.length)
            {
                this._member = this.members[this._i++];

                if ((this._member != null) && this._member.exists)
                {
                    this._member.kill();
                }
            }

        }

        /**
         * Helper function for the sort process.
         *
         * @param {Basic} Obj1 The first object being sorted.
         * @param {Basic} Obj2 The second object being sorted.
         *
         * @return {number} An integer value: -1 (Obj1 before Obj2), 0 (same), or 1 (Obj1 after Obj2).
         */
        public sortHandler(obj1, obj2): number {

            if (obj1[this._sortIndex] < obj2[this._sortIndex])
            {
                return this._sortOrder;
            }
            else if (obj1[this._sortIndex] > obj2[this._sortIndex])
            {
                return -this._sortOrder;
            }

            return 0;

        }

    }

}