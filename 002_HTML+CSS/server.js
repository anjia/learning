const http = require('http');
const fs = require('fs');

http.createServer((request, response) => {
    let body = [];
    request.on('error', (err) => {
        console.error(err);
    }).on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        console.log('body:', body);
        response.writeHead(200, {'Content-Type': 'text/html'});
        // response.end('Hello world.<br/>Good job!');
        fs.readFile('./index.html', function(err, data){
            if(err){
                throw err;
            }else{
                response.end(data);
            }
        });
    });
}).listen(8888);

console.log('Server has started\nhttp://localhost:8888/\n');