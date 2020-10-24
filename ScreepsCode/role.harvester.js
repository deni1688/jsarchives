const roleBuilder = require('role.builder');
const roleHarvester = {
    run: creep => {
        const carryEnergy = creep.carry.energy;
        const carryCapacity = creep.carryCapacity;

        // if it has capacity to carry more energy send it to do so
        if (carryEnergy < carryCapacity) {
            const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else {
            // suppy existing structures with energy or fill store objects
            const targets = creep.room.find(FIND_STRUCTURES, {
                filter: structure => {
                    return (structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_EXTENSION) && structure.energy < structure.energyCapacity;
                }
            });
            const containers = creep.room.find(FIND_STRUCTURES, {
                filter: container => container.structureType == STRUCTURE_CONTAINER && container.store[RESOURCE_ENERGY] < container.storeCapacity
            });
            if (targets.length) {
                // if the energy capacity is filled transfer it to the spawn
                // verify that its in proximity of the spawn - if not move it to the spawn
                if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                    creep.say('transfer');
                }
            } else if (containers.length) {
                if (creep.transfer(containers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(containers[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                    creep.say('transfer');
                }
            }
            else {
                // default to building
                roleBuilder.run(creep);
            }
        }
    }

}

module.exports = roleHarvester;