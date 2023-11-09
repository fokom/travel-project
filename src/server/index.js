const app = require('./server')

const port = 8081;
const server = app.listen(port, listening);

function listening(){
    console.log(`Server Running on localhost: ${port}`);
}

module.exports = server;

