import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import proxy from 'express-http-proxy';

const cors = require('cors')
dotenv.config();

const app: Express = express();
const port = process.env.PORT;
app.options(cors({
    origin: '*'
}))
const buildPath = path.normalize(path.join(__dirname, '../frontend/build'));
app.use(express.static(buildPath));

app.route('/api/latest/*')
    .get(proxy('http://127.0.0.1:8787/', { parseReqBody: false }))
    .head(proxy('http://127.0.0.1:8787/', { parseReqBody: false }))
    .post(proxy('http://127.0.0.1:8787/'))

app.route('/discount/*')
    .get(proxy('http://127.0.0.1:3000/discount/', { parseReqBody: false }))
    .head(proxy('http://127.0.0.1:3000/discount/', { parseReqBody: false }))
    .post(proxy('http://127.0.0.1:3000/discount/'))

app.get('*', proxy('http://127.0.0.1:8787/api/latest/oauth/authorize/', { parseReqBody: false }))

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});