const CalculateVolatility = require('./calculateVolatility');
const calculateVolatility = new CalculateVolatility();
calculateVolatility.calculateStdDev()
    .then(data => {
        console.log(data);
        const insertData = Object.assign(data, { id: 'stdDev', createdAt: Date.now() });
        console.log(insertData);
        return calculateVolatility.calculateStdDev();
    })
    .then(data => {
        console.log('got here');
        console.log(data);
    })
