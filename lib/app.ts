import * as express from "express";
import * as bodyParser from "body-parser";
import { Request, Response } from "express";
import { ChallongeCaller } from "./challongeFiles/challongeCaller";
import { ErrorHandler } from "./errorHandler"

class App {
  private challonge = new ChallongeCaller();
  private errorHandler = new ErrorHandler();

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  public app: express.Application;

  private config(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
  }

  private routes(): void {
    const router = express.Router();

    router.get('/', (req: Request, res: Response) => {
      res.status(200).send({
        message: 'Hello World!'
      })
    });

    router.get('/tournaments/:username/:apiKey', (req: Request, res: Response) => {
      console.log('requesting tournaments');
      
      this.challonge.getTournaments(req.params.username, req.params.apiKey, req.query.begDate, req.query.endDate)
        .then(response => {
          res.status(200).send({
            tournaments: response
          })
        }).catch(error => this.errorHandler.handleWebServiceError(error));
    });

    //takes in a list of tournaments
    router.get('/participants/:tournamentList', (req: Request, res: Response) => {
      console.log('requesting participans');

      this.challonge.getParticipants(req.params.tournamentList)
        .then(response => {
          res.status(200).send({
            participants: response
          })
        }).catch(error => this.errorHandler.handleWebServiceError(error));
    })
    router.post('/', (req: Request, res: Response) => {
      const data = req.body;
      // query a database and save data
      res.status(200).send(data);
    });

    this.app.use('/', router)

  }

}

export default new App().app;