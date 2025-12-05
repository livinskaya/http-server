const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

function sendJson(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(data));
}

function main(req, res) {
  try {
    if (req.method == "GET" && req.url === "/") {
      const fpath = path.join(__dirname, "public", "index.html");

      fs.readFile(fpath, (err, content) => {
        if (err) {
          res.statusCode = 404;
          res.setHeader("Content-Type", "text/html");
          return res.end("<h1>404 Datei niht gefunden</h1>");
        }
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        res.end(content);
      });
      return;
    }
    if (req.method === "GET" && req.url.startsWith("/users")) {
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
    res.statusCode = 404;
    res.setHeader("Content-Type", "text/html");
    res.end("<h1>404 not foind");
  } catch (err) {
    console.error("error:", err);
    sendJson(res, 500, { error: "Server error" });
  }
}

function withLogging(handler) {
  return (req, res) => {
    const start = Date.now();
    console.log("incoming", req.method, req.url);

    res.on("finish", () =>
      console.log("fertig", res.statusCode, Date.now() - start + "ms")
    );

    handler(req, res);
  };
}

const server = http.createServer(withLogging(main));
server.listen(3000, () => console.log("jo geht"));
