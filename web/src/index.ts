import express, { Express, Request, Response } from 'express';
import proxy from 'express-http-proxy';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.route('/api/latest/*')
    .get(proxy('http://127.0.0.1:8787/', { parseReqBody: false }))
    .head(proxy('http://127.0.0.1:8787/', { parseReqBody: false }))
    .post(proxy('http://127.0.0.1:8787/'))
app.use('/*', (req: Request, res: Response) => {
    res.send('Express+TypeScript Server');
});

app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});