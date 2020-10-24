module.exports = () => {
    const creepRoles = [
        {
            name: 'upgrader',
            count: _.filter(Game.creeps, creep => creep.memory.role == 'upgrader').length,
            min: 4,
            body: [WORK, WORK, WORK, CARRY, MOVE, MOVE]
        },
        {
            name: 'harvester',
            count: _.filter(Game.creeps, creep => creep.memory.role == 'harvester').length,
            min: 4,
            body: [WORK, WORK, WORK, CARRY, MOVE, MOVE]
        },
        {
            name: 'builder',
            count: _.filter(Game.creeps, creep => creep.memory.role == 'builder').length,
            min: 2,
            body: [WORK, CARRY, MOVE]
        },
        {
            name: 'repairer',
            count: _.filter(Game.creeps, creep => creep.memory.role == 'repairer').length,
            min: 2,
            body: [WORK, CARRY, MOVE]
        },
        {
            name: 'wallRepairer',
            count: _.filter(Game.creeps, creep => creep.memory.role == 'wallRepairer').length,
            min: 1,
            body: [WORK, CARRY, MOVE]
        }
    ];

    for (let role in creepRoles) {
        if (creepRoles[role].count < creepRoles[role].min) {
            const creepName = creepRoles[role].name + Game.time;
            console.log('Spawning new ' + creepName);
            Game.spawns['Spawn1'].spawnCreep(creepRoles[role].body, creepName,
                {memory: {role: creepRoles[role].name}});
            break;
        }
    }

    // show a text indicator next to the spawn when spawning a new creeps is in progress
    if (Game.spawns['Spawn1'].spawning) {
        const spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            {align: 'left', opacity: 0.8});
    }
};


