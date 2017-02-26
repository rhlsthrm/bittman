const CalculateTriggers = require('./calculateTriggers');
const calculateTriggers = new CalculateTriggers;
calculateTriggers.calculate(45)
    .then(console.log)