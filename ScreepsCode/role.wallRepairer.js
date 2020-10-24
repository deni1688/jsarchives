const roleWallRepairer = {
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
        if (creep.memory.working == true) {
            // find all walls in the room
            const walls = creep.room.find(FIND_STRUCTURES, {
                filter: structure => structure.structureType == STRUCTURE_WALL
            });

            let target = undefined;

            // loop with increasing percentages
            for (let percentage = 0.0001; percentage <= 1; percentage = percentage + 0.0001) {
                // find a wall with less than percentage hits
                for (let wall of walls) {
                    if (wall.hits / wall.hitsMax < percentage) {
                        target = wall;
                        break;
                    }
                }

                // if there is one
                if (target != undefined) {
                    // break the loop
                    break;
                }
            }

            // if we find a wall that has to be repaired
            if (target != undefined) {
                // try to repair it, if not in range
                if (creep.repair(target) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    creep.moveTo(target);
                }
            }
            // if we can't fine one
            else {
                // look for construction sites
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
module.exports = roleWallRepairer;