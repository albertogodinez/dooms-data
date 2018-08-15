exports.up = knex =>
  knex.schema
    .createTable('user', (table) => {
      table.increments('id').primary();
      table.string('username').notNullable();
      table.string('password').notNullable();
      table.string('email').notNullable();
    })
    .createTable('season', (table) => {
      table.increments('id').primary();
      table
        .integer('userId')
        .unsigned()
        .references('id')
        .inTable('user')
        .onDelete('SET NULL');
      table.string('seasonName').notNullable();
    })
    .createTable('tournament', (table) => {
      table.increments('id').primary();
      table
        .integer('seasonId')
        .unsigned()
        .references('id')
        .inTable('season')
        .onDelete('SET NULL');
      table.string('tournamentName').notNullable();
      table.integer('tournamentType');
      table.string('challongeUrl');
      table.date('tournamentDt').notNullable();
    })
    .createTable('participant', (table) => {
      table.increments('id').primary();
      table
        .integer('seasonId')
        .unsigned()
        .references('id')
        .inTable('season')
        .onDelete('SET NULL');
      table.string('gamertag').notNullable();
      table.integer('totalTournaments');
      table.integer('totalWins');
      table.integer('totalLosses');
      table.integer('totalSets');
      table.integer('highestPlacing');
      table.float('winningPercentage');
      table.date('firstAttendedDt');
      table.date('lastAttendedDt');
    })
    .createTable('match', (table) => {
      table.increments('id').primary();
      table
        .integer('seasonId')
        .unsigned()
        .references('id')
        .inTable('season')
        .onDelete('SET NULL');
      table.integer('tournamentId');
      table.integer('winnerId');
      table.integer('loserId');
      table.date('completedDt');
    })
    .createTable('tournamentTypes', (table) => {
      table.integer('id').primary();
      table.string('tournamentTypeName').notNullable();
    });

exports.down = knex =>
  knex.schema
    .dropTableIfExists('user')
    .dropTableIfExists('season')
    .dropTableIfExists('tournament')
    .dropTableIfExists('participant')
    .dropTableIfExists('match')
    .dropTableIfExists('tournamentTypes');
