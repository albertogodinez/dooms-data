import * as express from 'express';
import * as bodyParser from 'body-parser';
import { Request, Response } from 'express';
import { ChallongeCaller } from './challongeFiles/challongeCaller';
import { ErrorHandler } from './errorHandler';
import * as cors from 'cors';

const path = require('path');

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
    this.app.use(cors());
  }

  private routes(): void {
    const router = express.Router();

    router.get('/api/tournaments/:username/:apiKey', (req: Request, res: Response) => {
      console.log('requesting tournaments');
      this.challonge
        .getTournaments(
          req.params.username,
          req.params.apiKey,
          req.get('begDate'),
          req.get('endDate'),
        )
        .then(response => {
          res.status(200).send({
            tournaments: response,
          });
        })
        .catch(error => this.errorHandler.handleWebServiceError(error));
    });

    //takes in a list of tournaments
    //example: http://localhost:4040/participants/?array=["foo","bar"]
    /*
    * Currently this method is not being used
    */
    router.get('/api/participants/', (req: Request, res: Response) => {
      console.log('requesting participants');
      console.log('req.query: ' + JSON.stringify(req.query.array));
      var tournamentList = JSON.parse(req.query.tournamentList);
      this.challonge
        .getParticipants(tournamentList)
        .then(response => {
          res.status(200).send({
            participants: response,
          });
        })
        .catch(error => this.errorHandler.handleWebServiceError(error));
    });

    //takes in an optional list of participant gamertag changes
    //example: http://localhost:4040/participants/update/?updatedParticipants=[{participantId: 'ID', gamertag: 'newTag'}]
    router.get('/api/participants/update/', (req: Request, res: Response) => {
      console.log('updating participants');
      let updatedParticipants = JSON.parse(req.query.updatedParticipants);
      console.log('updatedParticipants: ' + JSON.stringify(updatedParticipants[0]));
      res.status(200).send({
        updatedParticipants: this.challonge.updateParticipants(updatedParticipants),
      });
    });

    /*
    * Currently this method is not being used
    * If used, you need to obtain the participants first
    */
    router.get('/api/matches/', (req: Request, res: Response) => {
      console.log('requesting matches');
      var tournamentList = JSON.parse(req.query.tournamentList);
      this.challonge.getMatches(tournamentList).then(response => {
        res.status(200).send({
          matches: response,
        });
      });
    });

    //takes in a list of tournaments
    //example: http://localhost:4040/api/participants/?array=["tournament1","tournament2"]
    router.get('/api/playerProfiles/', (req: Request, res: Response) => {
      var tournamentList = JSON.parse(req.query.tournamentList);
      //Validates that tournament list was sent
      if (!tournamentList || tournamentList.length === 0) {
        console.log('no tournament list was sent');
        res.status(400).send({
          message: 'No tournament list was sent',
        });
      }
      console.log('obtaining player profiles for following tournaments: ' + tournamentList);
      this.challonge.getParticipantProfiles(tournamentList).then(response => {
        // console.log('response from getParticipantProfiles: ' + JSON.stringify(response));
        res.status(200).send({
          playerProfiles: response,
        });
      });
      // res.status(200).send({
      //   playerProfiles: this.challonge.getParticipantProfiles(tournamentList),
      // });
    });
    router.get('/api/');

    router.post('/', (req: Request, res: Response) => {
      const data = req.body;
      // query a database and save data
      res.status(200).send(data);
    });

    this.app.use('/', router);
  }
}

export default new App().app;
