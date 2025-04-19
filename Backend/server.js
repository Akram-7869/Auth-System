const app = require('./app');
const config = require('./config/config');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const port = config.port;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, ()=>{
    console.log("server is listening Please go and check");
})