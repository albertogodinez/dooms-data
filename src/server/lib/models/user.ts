import { Model, RelationMappings } from 'objection';
import Season from './season';
import { join } from 'path';

export default class User extends Model {
  readonly id!: number;
  username?: string;
  password?: string;
  email?: string;

  // Optional eager relations.
  seasons?: Season[];

  // static tableName is the only required property
  static tableName = 'user';

  // Optional JSON schema. This is not the database schema! Nothing is generated
  // based on this. This is only used for validation. Whenever a model instance
  // is created it is checked against this schema. http://json-schema.org/.
  static jsonSchema = {
    type: 'object',
    required: ['username', 'password', 'email'],

    properties: {
      id: { type: 'integer' },
      username: { type: 'string', minLength: 1, maxLength: 255 },
      password: { type: 'string', minLength: 1, maxLength: 255 },
      email: { type: 'string', minLength: 1, maxLength: 255 },
    },
  };

  // Where to look for models classes.
  static modelPaths = [__dirname];

  // This object defines the relations to other models. The modelClass strings
  // will be joined to `modelPaths` to find the class definition, to avoid
  // require loops. The other solution to avoid require loops is to make
  // relationMappings a thunk. See Movie.ts for an example.
  static relationMappings: RelationMappings = {
    season: {
      relation: Model.HasManyRelation,
      // This model defines the `modelPaths` property. Therefore we can simply use
      // the model module names in `modelClass`.
      modelClass: 'Season',
      join: {
        from: 'user.id',
        to: 'season.userId',
      },
    },
  };
}

//
// Example of numeric timestamps. Presumably this would be in a base
// class or a mixin, and not just one of your leaf models.
//
//   $beforeInsert() {
//     this.createdAt = new Date();
//     this.updatedAt = new Date();
//   }

//   $beforeUpdate() {
//     this.updatedAt = new Date();
//   }

//   $parseDatabaseJson(json: object) {
//     json = super.$parseDatabaseJson(json);
//     toDate(json, 'createdAt');
//     toDate(json, 'updatedAt');
//     return json;
//   }

//   $formatDatabaseJson(json: object) {
//     json = super.$formatDatabaseJson(json);
//     toTime(json, 'createdAt');
//     toTime(json, 'updatedAt');
//     return json;
//   }
// }

// function toDate(obj: any, fieldName: string): any {
//   if (obj != null && typeof obj[fieldName] === 'number') {
//     obj[fieldName] = new Date(obj[fieldName]);
//   }
//   return obj;
// }

// function toTime(obj: any, fieldName: string): any {
//   if (obj != null && obj[fieldName] != null && obj[fieldName].getTime) {
//     obj[fieldName] = obj[fieldName].getTime();
//   }
//   return obj;
// }
