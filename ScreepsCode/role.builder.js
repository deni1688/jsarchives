const roleUpgrader = require('role.upgrader');

const roleBuilder = {
    run: creep => {
        const carryEnergy = creep.carry.energy;
        const carryCapacity = creep.carryCapacity;
        if (creep.memory.building && carryEnergy == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
        }
        else if (!creep.memory.building && carryEnergy == carryCapacity) {
            creep.memory.building = true;
            creep.say('🚧 build');
        }

        if (creep.memory.building) {
            const target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);

            if (target) {
                if (creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                // default to upgrading if there is nothing to build
                roleUpgrader.run(creep);
            }

        } else {
            const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
}

module.exports = roleBuilder;