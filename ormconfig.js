const ormOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'noodle',
  password: 'noodle',
  database: 'noodle',
  synchronize: true,
  logging: false,
  entities: [
    'src/entity/**/*.ts',
  ],
  migrations: [
    'src/migration/**/*.ts',
  ],
  subscribers: [
    'src/subscriber/**/*.ts',
  ],
  cli: {
    entitiesDir: 'src/entity',
    migrationsDir: 'src/migration',
    subscribersDir: 'src/subscriber',
  },
};

module.exports = ormOptions;
