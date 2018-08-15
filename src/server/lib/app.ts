import * as express from 'express';
import * as bodyParser from 'body-parser';
import { Request, Response } from 'express';
import * as cors from 'cors';
import { Model, transaction } from 'objection';
import * as Knex from 'knex';

import { ChallongeCaller } from './challongeFiles/challongeCaller';
import { ErrorHandler } from './errorHandler';
import User from './models/user';

// Note: Knex's PostgreSQL client allows you to set the initial
// search path for each connection automatically using an
// additional option "searchPath" as shown below
// var knex = require('knex')({
//   client: 'pg',
//   connection: process.env.PG_CONNECTION_STRING,
//   searchPath: ['knex', 'public'],
// });
const knexConfig = require('../../../knexfile');
// Initialize knex.
export const knex = Knex(knexConfig.development);
// Create or migrate:
knex.migrate.latest();

// Bind all Models to a knex instance. If you only have one database in
// your server this is all you have to do. For multi database systems, see
// the Model.bindKnex method.
Model.knex(knex);

// Unfortunately the express-promise-router types are borked. Just require():
// const router = require('express-promise-router')(); // DONT THINK I NEED THIS

class App {
  private challonge = new ChallongeCaller();
  private errorHandler = new ErrorHandler();
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.routes();
  }

  private config(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(cors());
  }

  private routes(): void {
    const router = express.Router();

    /**
     * If all you want to do is insert a single person
     * `insertGraph` and `allowInsert` can be replaced with
     * `insert()`
     */
    router.post('/api/signUp/', async (req: Request, res: Response) => {
      console.log('username: ' + req.params.username);
      console.log('password: ' + req.params.password);
      console.log('email: ' + req.params.email);

      const graph = req.body;
      console.log('request body: ' + JSON.stringify(graph));
      const insertedGraph = await transaction(User.knex(), trx => {
        return (
          User.query(trx)
            // For security reasons, limit the relations that can be inserted.
            .allowInsert('[username, password, email]')
            .insertGraph(graph)
        );
      });

      res.send(insertedGraph);
    });

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
    * If used, you need to obtain the participants
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
