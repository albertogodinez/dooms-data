import { Model, RelationMappings } from 'objection';
import { join } from 'path';
import Season from './season';
import Participant from './participant';
import Tournament from './tournament';

export default class TournamentType extends Model {
  readonly id!: number;
  tournamentTypeName: string;

  // Optional eager relations
  tournament?: Tournament[];

  // static tableName is the only required property
  static tableName = 'tournament_types';

  static jsonSchema = {
    type: 'object',
    required: [],

    properties: {
      id: { type: 'integer' },
      tournamentTypeName: { type: 'string', minLength: 1, maxLength: 255 },
    },
  };

  // Where to look for models classes.
  static modelPaths = [__dirname];

  static relationMappings: RelationMappings = {
    tournaments: {
      relation: Model.HasManyRelation,
      modelClass: 'Tournament',
      join: {
        from: 'tournamentType.id',
        to: 'tournament.tournamentType',
      },
    },
  };
}
