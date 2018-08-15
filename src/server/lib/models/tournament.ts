import { Model, RelationMappings } from 'objection';
import { join } from 'path';
import Season from './season';
import Match from './match';
import TournamentTypes from './tournamentTypes';

export default class Tournament extends Model {
  readonly id!: number;
  seasonId?: number;
  tournamentName?: string;
  tournamentType?: number;
  challongeUrl?: string;
  tournamentDt?: Date;

  // Optional eager relations
  season?: Season;
  matches?: Match[];
  tournamentTypes?: TournamentTypes;

  // static tableName is the only required property
  static tableName = 'tournament';

  static jsonSchema = {
    type: 'object',
    required: ['tournamentName'],

    properties: {
      id: { type: 'integer' },
      seasonId: { type: 'integer' },
      tournamentName: { type: 'string', minLength: 1, maxLength: 255 },
      tournamentType: { type: 'integer' },
      challongeUrl: { type: 'string', minLength: 1, maxLength: 255 },
      tournamentDt: { type: 'date' },
    },
  };

  // Where to look for models classes.
  static modelPaths = [__dirname];

  static relationMappings: RelationMappings = {
    season: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'Season',
      join: {
        from: 'tournament.seasonId',
        to: 'season.id',
      },
    },
    matches: {
      relation: Model.HasManyRelation,
      modelClass: 'Match',
      join: {
        from: 'tournament.id',
        to: 'match.tournamentId',
      },
    },
    tournamentType: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'TournamentTypes',
      join: {
        from: 'tournament.tournamentType',
        to: 'tournamentTypes.id',
      },
    },
  };
}
