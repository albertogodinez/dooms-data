import { Model, RelationMappings } from 'objection';
import { join } from 'path';
import Season from './season';
import Participant from './participant';
import Tournament from './tournament';

export default class Match extends Model {
  readonly id!: number;
  seasonId?: number;
  tournamentId?: number;
  winnerId?: number;
  loserId?: number;
  completedDt?: Date;

  // Optional eager relations
  season?: Season;
  tournament?: Tournament;
  participants?: Participant[];

  // static tableName is the only required property
  static tableName = 'match';

  static jsonSchema = {
    type: 'object',
    required: [],

    properties: {
      id: { type: 'integer' },
      seasonId: { type: 'integer' },
      tournamentId: { type: 'integer' },
      winnerId: { type: 'integer' },
      loserId: { type: 'integer' },
      completedDt: { type: 'date' },
    },
  };

  // Where to look for models classes.
  static modelPaths = [__dirname];

  static relationMappings: RelationMappings = {
    season: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'Season',
      join: {
        from: 'match.seasonId',
        to: 'season.id',
      },
    },
    tournament: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'Tournament',
      join: {
        from: 'match.tournamentId',
        to: 'tournament.id',
      },
    },
    winner: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'Participant',
      join: {
        from: 'match.winnerId',
        to: 'participant.id',
      },
    },
    loser: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'Participant',
      join: {
        from: 'match.loserId',
        to: 'participant.id',
      },
    },
  };
}
