const http = require("http");

http
.createServer((req,res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  
  res.end("Teste Prático Back-end MOS.gg");
  
})
.listen(8000, () => console.log("Servidor porta 8000 ok"));