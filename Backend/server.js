

const app = require('./app');
const http = require('http');
const server = http.createServer(app);
const port = process.env.APPPORT || 8000;
server.listen( port , () => {
    console.log('Congrats , the server is listening on port ', port);
});

app.get('/health', (req, res, next) => {
    console.log('your app is Working');
})

module.exports = app;