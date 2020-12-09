import express from 'express';

export default class Server {

    public app: express.Application;
    public port: number;

    constructor () {
        this.app = express();
        this.port = Number(process.env.PORT) || 3001;
    }

    start( callback: Function) {
        //this.app.listen( this.port, callback );
        this.app.listen( this.port, callback() );
    }


}