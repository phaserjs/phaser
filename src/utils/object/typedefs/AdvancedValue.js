/**
 * @name Phaser.Types.Utils.Objects.AdvancedValue
 * @typedef {number|any|Phaser.Types.Utils.AdvancedValue.RandomElement|Phaser.Types.Utils.Objects.AdvancedValue.RandomElement|Phaser.Types.Utils.AdvancedValue.RandomInteger|Phaser.Types.Utils.AdvancedValue.RandomFloat}
 * 
 * @generic {any=Object} T
 * @genericUse {
 *                     | T
 *                     | Phaser.Types.Utils.Objects.AdvancedValue.RandomElement<T>
 *                     | Phaser.Types.Utils.Objects.AdvancedValue.CallbackFunction<T>
 *                     | (T extends number ? Phaser.Types.Utils.Objects.AdvancedValue.RandomInteger | Phaser.Types.Utils.Objects.AdvancedValue.RandomFloat
 *                                         : never)} - [$type]
 */
