const http = require("node:http");
const { json } = require("node:stream/consumers");

const server = http.createServer((req, res) => {
  if (req.method === "GET" && req.url === "/") {
    res.setHeader("Content-type", "text/html");
    const html = `<html>
                    <body>
                    <h1>Test</h1>
                    <ul>
                    <li>1</li>
                    <li>2</li>
                    <li>3</li>
                    </ul>
                    </body>
    
    `;
    res.end(html);
    return;
  } else if (req.method === "GET" && req.url.startsWith("/users")) {
    res.setHeader("Content-type", "application/json");

    const data = [{ id: 1, name: "lando" }];

    res.end(JSON.stringify(data));
    return;
  }
  if (req.method === "GET" && req.url.startsWith("/add")) {
    const parsed = new URL(req.url, "http://localhost:3000");
    const x = parsed.searchParams.get("x");
    const y = parsed.searchParams.get("y");
    const sum = Number(x) + Number(y);
    res.end(JSON.stringify({ result: sum }));

    return;
  }
  if (req.method === "POST" && req.url.startsWith("/echo")) {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        const json = JSON.parse(body);
        res.setHeader("Content-type", "application/json");
        res.end(JSON.stringify(json));
      } catch (error) {
        res.end("Json und so");
      }
    });
    return;
  }
  res.setHeader("Content-type", "application/json");
  res.end("HELLOOOO");
});

server.listen(3000, () => {
  console.log("Server läuft auf 3000");
});
