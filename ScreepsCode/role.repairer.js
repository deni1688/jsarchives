const roleBuilder = require('role.builder');

module.exports = {
    run: creep => {
        const carryEnergy = creep.carry.energy;
        const carryCapacity = creep.carryCapacity;

        if (creep.memory.working && carryEnergy < 1) {
            creep.memory.working = false;
        }
        else if (!creep.memory.working && carryEnergy == carryCapacity) {
            creep.memory.working = true;
        }

        // if creep is supposed to repair something
        if (creep.memory.working) {
            // find closest structure with less than max hits
            // our repairers busy forever. We have to find a solution for that later.
            // TODO: create a wall repairer role
            const structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: structure => structure.hits < structure.hitsMax && structure.structureType !== STRUCTURE_WALL
            });

            // if we find one
            if (structure) {
                // try to repair it, if it is out of range
                if (creep.repair(structure) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(structure);
                }
            }

            else {
                // default to builder role
                roleBuilder.run(creep);
            }
        }
        else {
            // finding the closest source - accounting for multiple sources on the map
            const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            // move to source if out of range
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                creep.say('harvest')
            }
        }
    }
};