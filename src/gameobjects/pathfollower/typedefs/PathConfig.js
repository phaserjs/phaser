/**
 * Settings for a PathFollower.
 *
 * @typedef {object} Phaser.GameObjects.PathFollower.Types.PathConfig
 * @since 3.0.0
 *
 * @property {number} duration - The duration of the path follow.
 * @property {number} from - The start position of the path follow, between 0 and 1.
 * @property {number} to - The end position of the path follow, between 0 and 1.
 * @property {boolean} [positionOnPath=false] - Whether to position the PathFollower on the Path using its path offset.
 * @property {boolean} [rotateToPath=false] - Should the PathFollower automatically rotate to point in the direction of the Path?
 * @property {number} [rotationOffset=0] - If the PathFollower is rotating to match the Path, this value is added to the rotation value. This allows you to rotate objects to a path but control the angle of the rotation as well.
 * @property {number} [startAt=0] - Current start position of the path follow, between 0 and 1.
 */
