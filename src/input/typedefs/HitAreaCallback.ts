import { TODO_MIGRATE_GameObjectInstance } from '../../utils/migrationPlaceholders.js';

/**
 * @callback Phaser.Types.Input.HitAreaCallback
 * @since 3.0.0
 *
 * @param hitArea - The hit area object.
 * @param x - The translated x coordinate of the hit test event.
 * @param y - The translated y coordinate of the hit test event.
 * @param gameObject - The Game Object that invoked the hit test.
 *
 * @return `true` if the coordinates fall within the space of the hitArea, otherwise `false`.
 */
export type HitAreaCallback<T = unknown> = (hitArea: T, x: number, y: number, gameObject: TODO_MIGRATE_GameObjectInstance) => boolean;
