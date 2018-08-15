import { Model, RelationMappings } from 'objection';
import { join } from 'path';
import Season from './season';
import Match from './match';

export default class Participant extends Model {
  readonly id!: number;
  seasonId?: number;
  gamertag!: string;
  totalTournaments?: number;
  totalWins?: number;
  totalLosses?: number;
  totalSets?: number;
  highestPlacing?: number;
  winningPercentage: number;
  firstAttendedDt: Date;
  lastAttendendDt: Date;

  // Optional eager relations
  season?: Season;
  matches?: Match[];

  // static tableName is the only required property
  static tableName = 'participant';

  static jsonSchema = {
    type: 'object',
    required: ['gamertag'],

    properties: {
      id: { type: 'integer' },
      seasonId: { type: 'integer' },
      gamertag: { type: 'string', minLength: 1, maxLength: 255 },
      totalTournaments: { type: 'integer' },
      totalWins: { type: 'integer' },
      totalLosses: { type: 'integer' },
      totalSets: { type: 'integer' },
      highestPlacing: { type: 'integer' },
      winningPercentage: { type: 'float' },
      firstAttendedDt: { type: 'date' },
      lastAttendendDt: { type: 'date' },
    },
  };

  // Where to look for models classes.
  static modelPaths = [__dirname];

  static relationMappings: RelationMappings = {
    season: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'Season',
      join: {
        from: 'participant.seasonId',
        to: 'season.id',
      },
    },
    winners: {
      relation: Model.HasManyRelation,
      modelClass: 'Match',
      join: {
        from: 'participant.id',
        to: 'match.winnerId',
      },
    },
    losers: {
      relation: Model.HasManyRelation,
      modelClass: 'Match',
      join: {
        from: 'participant.id',
        to: 'match.loserId',
      },
    },
  };
}
