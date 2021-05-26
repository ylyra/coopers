let database
if (process.env.TYPEORM_TYPE === "postgres") {
  database = {
    "host": process.env.TYPEORM_HOST,
    "port": process.env.TYPEORM_PORT,
    "username": process.env.TYPEORM_USERNAME,
    "password": process.env.TYPEORM_PASSWORD,
  }
}

module.exports = {
  "type": process.env.TYPEORM_TYPE,
  ...database,
  "database": process.env.TYPEORM_DATABASE,
  "entities": [process.env.TYPEORM_ENTITIES],
  "migrations": [process.env.TYPEORM_MIGRATIONS],
  "cli": {
    "migrationsDir": process.env.TYPEORM_MIGRATIONS_DIR
  },
  "ssl": {
    "rejectUnauthorized": false,
  }
}