import { Model, RelationMappings } from 'objection';
import { join } from 'path';
import User from './user';
import Participant from './participant';
import Tournament from './tournament';
import Match from './match';

export default class Season extends Model {
  readonly id!: number;
  userId?: number;
  seasonName!: string;

  // Optional eager relations
  user?: User;
  participants?: Participant[];
  tournaments?: Tournament[];
  matches?: Match[];

  // static tableName is the only required property
  static tableName = 'season';

  static jsonSchema = {
    type: 'object',
    required: ['seasonName'],

    properties: {
      id: { type: 'integer' },
      userId: { type: 'integer' },
      seasonName: { type: 'string', minLength: 1, maxLength: 255 },
    },
  };

  // Where to look for models classes.
  static modelPaths = [__dirname];

  static relationMappings: RelationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'User',
      join: {
        from: 'season.userId',
        to: 'user.id',
      },
    },
    participants: {
      relation: Model.HasManyRelation,
      modelClass: 'Participant',
      join: {
        from: 'season.id',
        to: 'participant.seasonId',
      },
    },
    tournaments: {
      relation: Model.HasManyRelation,
      modelClass: 'Tournament',
      join: {
        from: 'season.id',
        to: 'tournament.seasonId',
      },
    },
    matches: {
      relation: Model.HasManyRelation,
      modelClass: 'Match',
      join: {
        from: 'season.id',
        to: 'tournament.seasonId',
      },
    },
  };
}
