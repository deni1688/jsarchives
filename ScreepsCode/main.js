require('prototype.creep');
const autoSpawnCreeps = require('auto.spawnCreeps');

module.exports.loop = function () {
    // repair and defend structures
    for (let name in Game.rooms) {
        const towers = Game.rooms[name].find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
        const tower = Game.getObjectById(towers[0].id);
        if (tower) {
            const closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: structure => structure.hits < structure.hitsMax
            });
            if (closestDamagedStructure) {
                tower.repair(closestDamagedStructure);
            }

            const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (closestHostile) {
                tower.attack(closestHostile);
            }
        }

    }


    // clear memory of creep that died
    for (let name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    // loop through roles and send to work
    for (let name in Game.creeps) {
        Game.creeps[name].runRole();
    }

    autoSpawnCreeps();
};