// Collision Types - Determine if and how entities collide with each other

// In ACTIVE vs. LITE or FIXED vs. ANY collisions, only the "weak" entity moves,
// while the other one stays fixed. In ACTIVE vs. ACTIVE and ACTIVE vs. PASSIVE
// collisions, both entities are moved. LITE or PASSIVE entities don't collide
// with other LITE or PASSIVE entities at all. The behaiviour for FIXED vs.
// FIXED collisions is undefined.

module.exports = {

    NEVER: 0,
    LITE: 1,
    PASSIVE: 2,
    ACTIVE: 4,
    FIXED: 8

};
