

const app = require('./app');
const http = require('http');
const server = http.createServer(app);
server.listen(process.env.PORT || 8000 , () => {
    console.log('Congrats , the server is listening on port 3000');
});

app.get('/health', (req, res, next) => {
    console.log('your app is Working');
})

module.exports = app;