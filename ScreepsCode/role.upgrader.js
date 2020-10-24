const roleUpgrader = {
    run: creep => {
        const carryEnergy = creep.carry.energy;
        const carryCapacity = creep.carryCapacity;

        if (creep.memory.working && carryEnergy < 1) {
            creep.memory.working = false;
        }
        else if (!creep.memory.working && carryEnergy == carryCapacity) {
            creep.memory.working = true;
        }

        // send the creep to find energy if its at 0 energy
        if (creep.memory.working) {

            // if the energy capacity is filled transfer it to the room controller
            // verify that its in proximity of the controller
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffaa00'}});
                creep.say('upgrade')
            }

        } else {
            const containers = creep.room.find(FIND_STRUCTURES, {
                filter: container => container.structureType == STRUCTURE_CONTAINER && container.store[RESOURCE_ENERGY] >= carryCapacity
            });
            // use container as energy source if available
            if (containers.length) {
                const container = containers[0];
                if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container)
                }
            } else {
                // finding the closest source - accounting for multiple sources on the map
                const source = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
                // move to source if out of range
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                    creep.say('harvest');
                }
            }


        }
    }
};
module.exports = roleUpgrader;