/// <reference path="Basic.ts" />
/// <reference path="Game.ts" />

/**
* Phaser - Group
*
* This class is used for organising, updating and sorting game objects.
*
*/

module Phaser {

    export class Group extends Basic {

        constructor(game: Game, MaxSize?: number = 0) {

            super(game);

            this.isGroup = true;
            this.members = [];
            this.length = 0;
            this._maxSize = MaxSize;
            this._marker = 0;
            this._sortIndex = null;

        }

        /**
         * Use with <code>sort()</code> to sort in ascending order.
         */
        public static ASCENDING: number = -1;

        /**
         * Use with <code>sort()</code> to sort in descending order.
         */
        public static DESCENDING: number = 1;

        /**
         * Array of all the <code>Basic</code>s that exist in this group.
         */
        public members: Basic[];

        /**
         * The number of entries in the members array.
         * For performance and safety you should check this variable
         * instead of members.length unless you really know what you're doing!
         */
        public length: number;

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
         * Override this function to handle any deleting or "shutdown" type operations you might need,
         * such as removing traditional Flash children like Basic objects.
         */
        public destroy() {

            if (this.members != null)
            {
                var basic: Basic;
                var i: number = 0;

                while (i < this.length)
                {
                    basic = this.members[i++];

                    if (basic != null)
                    {
                        basic.destroy();
                    }
                }

                this.members.length = 0;
            }

            this._sortIndex = null;

        }

        /**
         * Automatically goes through and calls update on everything you added.
         */
        public update() {

            var basic: Basic;
            var i: number = 0;

            while (i < this.length)
            {
                basic = this.members[i++];

                if ((basic != null) && basic.exists && basic.active)
                {
                    basic.preUpdate();
                    basic.update();
                    basic.postUpdate();
                }
            }
        }

        /**
         * Automatically goes through and calls render on everything you added.
         */
        public render(camera: Camera, cameraOffsetX: number, cameraOffsetY: number) {

            var basic: Basic;
            var i: number = 0;

            while (i < this.length)
            {
                basic = this.members[i++];

                if ((basic != null) && basic.exists && basic.visible)
                {
                    basic.render(camera, cameraOffsetX, cameraOffsetY);
                }
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

            if ((this._maxSize == 0) || (this.members == null) || (this._maxSize >= this.members.length))
            {
                return;
            }

            //If the max size has shrunk, we need to get rid of some objects
            var basic: Basic;
            var i: number = this._maxSize;
            var l: number = this.members.length;

            while (i < l)
            {
                basic = this.members[i++];

                if (basic != null)
                {
                    basic.destroy();
                }
            }

            this.length = this.members.length = this._maxSize;
        }

        /**
         * Adds a new <code>Basic</code> subclass (Basic, Basic, Enemy, etc) to the group.
         * Group will try to replace a null member of the array first.
         * Failing that, Group will add it to the end of the member array,
         * assuming there is room for it, and doubling the size of the array if necessary.
         *
         * <p>WARNING: If the group has a maxSize that has already been met,
         * the object will NOT be added to the group!</p>
         *
         * @param	Object		The object you want to add to the group.
         *
         * @return	The same <code>Basic</code> object that was passed in.
         */
        public add(Object: Basic) {

            //Don't bother adding an object twice.
            if (this.members.indexOf(Object) >= 0)
            {
                return Object;
            }

            //First, look for a null entry where we can add the object.
            var i: number = 0;
            var l: number = this.members.length;

            while (i < l)
            {
                if (this.members[i] == null)
                {
                    this.members[i] = Object;

                    if (i >= this.length)
                    {
                        this.length = i + 1;
                    }

                    return Object;
                }

                i++;
            }

            //Failing that, expand the array (if we can) and add the object.
            if (this._maxSize > 0)
            {
                if (this.members.length >= this._maxSize)
                {
                    return Object;
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
            this.members[i] = Object;
            this.length = i + 1;

            return Object;

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
         * @param	ObjectClass		The class type you want to recycle (e.g. Basic, EvilRobot, etc). Do NOT "new" the class in the parameter!
         * 
         * @return	A reference to the object that was created.  Don't forget to cast it back to the Class you want (e.g. myObject = myGroup.recycle(myObjectClass) as myObjectClass;).
         */
        public recycle(ObjectClass = null) {

            var basic;

            if (this._maxSize > 0)
            {
                if (this.length < this._maxSize)
                {
                    if (ObjectClass == null)
                    {
                        return null;
                    }

                    return this.add(new ObjectClass(this._game));
                }
                else
                {
                    basic = this.members[this._marker++];

                    if (this._marker >= this._maxSize)
                    {
                        this._marker = 0;
                    }

                    return basic;
                }
            }
            else
            {
                basic = this.getFirstAvailable(ObjectClass);

                if (basic != null)
                {
                    return basic;
                }

                if (ObjectClass == null)
                {
                    return null;
                }

                return this.add(new ObjectClass(this._game));
            }
        }

        /**
         * Removes an object from the group.
         * 
         * @param	Object	The <code>Basic</code> you want to remove.
         * @param	Splice	Whether the object should be cut from the array entirely or not.
         * 
         * @return	The removed object.
         */
        public remove(Object: Basic, Splice: bool = false): Basic {

            var index: number = this.members.indexOf(Object);

            if ((index < 0) || (index >= this.members.length))
            {
                return null;
            }

            if (Splice)
            {
                this.members.splice(index, 1);
                this.length--;
            }
            else
            {
                this.members[index] = null;
            }

            return Object;

        }

        /**
         * Replaces an existing <code>Basic</code> with a new one.
         * 
         * @param	OldObject	The object you want to replace.
         * @param	NewObject	The new object you want to use instead.
         * 
         * @return	The new object.
         */
        public replace(OldObject: Basic, NewObject: Basic): Basic {

            var index: number = this.members.indexOf(OldObject);

            if ((index < 0) || (index >= this.members.length))
            {
                return null;
            }

            this.members[index] = NewObject;

            return NewObject;

        }

        /**
         * Call this function to sort the group according to a particular value and order.
         * For example, to sort game objects for Zelda-style overlaps you might call
         * <code>myGroup.sort("y",Group.ASCENDING)</code> at the bottom of your
         * <code>State.update()</code> override.  To sort all existing objects after
         * a big explosion or bomb attack, you might call <code>myGroup.sort("exists",Group.DESCENDING)</code>.
         * 
         * @param	Index	The <code>string</code> name of the member variable you want to sort on.  Default value is "y".
         * @param	Order	A <code>Group</code> constant that defines the sort order.  Possible values are <code>Group.ASCENDING</code> and <code>Group.DESCENDING</code>.  Default value is <code>Group.ASCENDING</code>.  
         */
        public sort(Index: string = "y", Order: number = Group.ASCENDING) {

            this._sortIndex = Index;
            this._sortOrder = Order;
            this.members.sort(this.sortHandler);

        }

        /**
         * Go through and set the specified variable to the specified value on all members of the group.
         * 
         * @param	VariableName	The string representation of the variable name you want to modify, for example "visible" or "scrollFactor".
         * @param	Value			The value you want to assign to that variable.
         * @param	Recurse			Default value is true, meaning if <code>setAll()</code> encounters a member that is a group, it will call <code>setAll()</code> on that group rather than modifying its variable.
         */
        public setAll(VariableName: string, Value: Object, Recurse: bool = true) {

            var basic: Basic;
            var i: number = 0;

            while (i < length)
            {
                basic = this.members[i++];

                if (basic != null)
                {
                    if (Recurse && (basic.isGroup == true))
                    {
                        <Group> basic['setAll'](VariableName, Value, Recurse);
                    }
                    else
                    {
                        basic[VariableName] = Value;
                    }
                }
            }
        }

        /**
         * Go through and call the specified function on all members of the group.
         * Currently only works on functions that have no required parameters.
         * 
         * @param	FunctionName	The string representation of the function you want to call on each object, for example "kill()" or "init()".
         * @param	Recurse			Default value is true, meaning if <code>callAll()</code> encounters a member that is a group, it will call <code>callAll()</code> on that group rather than calling the group's function.
         */
        public callAll(FunctionName: string, Recurse: bool = true) {

            var basic: Basic;
            var i: number = 0;

            while (i < this.length)
            {
                basic = this.members[i++];

                if (basic != null)
                {
                    if (Recurse && (basic.isGroup == true))
                    {
                        <Group> basic['callAll'](FunctionName, Recurse);
                    }
                    else
                    {
                        basic[FunctionName]();
                    }
                }
            }
        }

        public forEach(callback, recursive: bool = false) {

            var basic;
            var i: number = 0;

            while (i < this.length)
            {
                basic = this.members[i++];

                if (basic != null)
                {
                    if (recursive && (basic.isGroup == true))
                    {
                        basic.forEach(callback, true);
                    }
                    else
                    {
                        callback.call(this, basic);
                    }
                }
            }

        }

        public forEachAlive(callback, recursive: bool = false) {

            var basic;
            var i: number = 0;

            while (i < this.length)
            {
                basic = this.members[i++];

                if (basic != null && basic.alive)
                {
                    if (recursive && (basic.isGroup == true))
                    {
                        basic.forEachAlive(callback, true);
                    }
                    else
                    {
                        callback.call(this, basic);
                    }
                }
            }

        }

        /**
         * Call this function to retrieve the first object with exists == false in the group.
         * This is handy for recycling in general, e.g. respawning enemies.
         * 
         * @param	ObjectClass		An optional parameter that lets you narrow the results to instances of this particular class.
         * 
         * @return	A <code>Basic</code> currently flagged as not existing.
         */
        public getFirstAvailable(ObjectClass = null) {

            var basic;
            var i: number = 0;

            while (i < this.length)
            {
                basic = this.members[i++];

                if ((basic != null) && !basic.exists && ((ObjectClass == null) || (typeof basic === ObjectClass)))
                {
                    return basic;
                }

            }

            return null;
        }

        /**
         * Call this function to retrieve the first index set to 'null'.
         * Returns -1 if no index stores a null object.
         * 
         * @return	An <code>int</code> indicating the first null slot in the group.
         */
        public getFirstNull(): number {

            var basic: Basic;
            var i: number = 0;
            var l: number = this.members.length;

            while (i < l)
            {
                if (this.members[i] == null)
                {
                    return i;
                }
                else
                {
                    i++;
                }
            }

            return -1;

        }

        /**
         * Call this function to retrieve the first object with exists == true in the group.
         * This is handy for checking if everything's wiped out, or choosing a squad leader, etc.
         * 
         * @return	A <code>Basic</code> currently flagged as existing.
         */
        public getFirstExtant(): Basic {

            var basic: Basic;
            var i: number = 0;

            while (i < length)
            {
                basic = this.members[i++];

                if ((basic != null) && basic.exists)
                {
                    return basic;
                }
            }

            return null;

        }

        /**
         * Call this function to retrieve the first object with dead == false in the group.
         * This is handy for checking if everything's wiped out, or choosing a squad leader, etc.
         * 
         * @return	A <code>Basic</code> currently flagged as not dead.
         */
        public getFirstAlive(): Basic {

            var basic: Basic;
            var i: number = 0;

            while (i < this.length)
            {
                basic = this.members[i++];

                if ((basic != null) && basic.exists && basic.alive)
                {
                    return basic;
                }
            }

            return null;

        }

        /**
         * Call this function to retrieve the first object with dead == true in the group.
         * This is handy for checking if everything's wiped out, or choosing a squad leader, etc.
         * 
         * @return	A <code>Basic</code> currently flagged as dead.
         */
        public getFirstDead(): Basic {

            var basic: Basic;
            var i: number = 0;

            while (i < this.length)
            {
                basic = this.members[i++];

                if ((basic != null) && !basic.alive)
                {
                    return basic;
                }
            }

            return null;

        }

        /**
         * Call this function to find out how many members of the group are not dead.
         * 
         * @return	The number of <code>Basic</code>s flagged as not dead.  Returns -1 if group is empty.
         */
        public countLiving(): number {

            var count: number = -1;
            var basic: Basic;
            var i: number = 0;

            while (i < this.length)
            {
                basic = this.members[i++];

                if (basic != null)
                {
                    if (count < 0)
                    {
                        count = 0;
                    }

                    if (basic.exists && basic.alive)
                    {
                        count++;
                    }
                }
            }

            return count;

        }

        /**
         * Call this function to find out how many members of the group are dead.
         * 
         * @return	The number of <code>Basic</code>s flagged as dead.  Returns -1 if group is empty.
         */
        public countDead(): number {

            var count: number = -1;
            var basic: Basic;
            var i: number = 0;

            while (i < this.length)
            {
                basic = this.members[i++];

                if (basic != null)
                {
                    if (count < 0)
                    {
                        count = 0;
                    }

                    if (!basic.alive)
                    {
                        count++;
                    }
                }
            }

            return count;

        }

        /**
         * Returns a member at random from the group.
         * 
         * @param	StartIndex	Optional offset off the front of the array. Default value is 0, or the beginning of the array.
         * @param	Length		Optional restriction on the number of values you want to randomly select from.
         * 
         * @return	A <code>Basic</code> from the members list.
         */
        public getRandom(StartIndex: number = 0, Length: number = 0): Basic {

            if (Length == 0)
            {
                Length = this.length;
            }

            return this._game.math.getRandom(this.members, StartIndex, Length);

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

            var basic: Basic;
            var i: number = 0;

            while (i < this.length)
            {
                basic = this.members[i++];

                if ((basic != null) && basic.exists)
                {
                    basic.kill();
                }
            }

        }

        /**
         * Helper function for the sort process.
         * 
         * @param 	Obj1	The first object being sorted.
         * @param	Obj2	The second object being sorted.
         * 
         * @return	An integer value: -1 (Obj1 before Obj2), 0 (same), or 1 (Obj1 after Obj2).
         */
        public sortHandler(Obj1: Basic, Obj2: Basic): number {

            if (Obj1[this._sortIndex] < Obj2[this._sortIndex])
            {
                return this._sortOrder;
            }
            else if (Obj1[this._sortIndex] > Obj2[this._sortIndex])
            {
                return -this._sortOrder;
            }

            return 0;

        }

    }

}