const roles = {
    harvester: require('role.harvester'),
    upgrader: require('role.upgrader'),
    builder: require('role.builder'),
    repairer: require('role.repairer'),
    wallRepairer: require('role.wallRepairer'),
};
// simplifying creep role selection
Creep.prototype.runRole = function () {
    roles[this.memory.role].run(this);
};
