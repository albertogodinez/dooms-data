module.exports = {
  development: {
    client: 'pg',
    useNullAsDefault: true,
    connection: {
      filename: './doomsdata.db',
    },
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'doomsdata',
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
};
