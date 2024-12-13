import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { getEnvVars } from './scripts/database-config-utils';

function dbSslConfig(envVars) {
  let config = {};

  if (envVars?.DATABASE_URL)
    config = {
      url: envVars.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    };

  if (envVars?.CA_CERT)
    config = {
      ...config,
      ...{ ssl: { rejectUnauthorized: false, ca: envVars.CA_CERT } },
    };

  return config;
}

function jumpstartDbSslConfig(envVars) {
  let config = {};

  if (envVars?.JUMPSTART_DB_URL)
    config = {
      url: envVars.JUMPSTART_DB_URL,
      ssl: { rejectUnauthorized: false },
    };

  if (envVars?.CA_CERT)
    config = {
      ...config,
      ...{ ssl: { rejectUnauthorized: false, ca: envVars.CA_CERT } },
    };

  return config;
}

function buildConnectionOptions(data): TypeOrmModuleOptions {
  const connectionParams = {
    database: data.PG_DB,
    port: +data.PG_PORT || 5432,
    username: data.PG_USER,
    password: data.PG_PASS,
    host: data.PG_HOST,
    connectTimeoutMS: 5000,
    extra: {
      max: 25,
    },
    ...dbSslConfig(data),
  };

  const entitiesDir =
    data?.NODE_ENV === 'test' ? [__dirname + '/**/*.entity.ts'] : [__dirname + '/**/*.entity{.js,.ts}'];

  return {
    type: 'postgres',
    ...connectionParams,
    entities: entitiesDir,
    synchronize: false,
    uuidExtension: 'pgcrypto',
    migrationsRun: false,
    migrationsTransactionMode: 'all',
    logging: data.ORM_LOGGING || false,
    migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
    keepConnectionAlive: true,
    cli: {
      migrationsDir: 'migrations',
    },
  };
}

function buildJumpStartDbConnectionOptions(data): TypeOrmModuleOptions {
  const connectionParams = {
    database: data.JUMPSTART_DB,
    port: +data.JUMPSTART_DB_PORT || 5432,
    username: data.JUMPSTART_DB_USER,
    password: data.JUMPSTART_DB_PASS,
    host: data.JUMPSTART_DB_HOST,
    connectTimeoutMS: 5000,
    logging: data.ORM_LOGGING || false,
    extra: {
      max: 25,
    },
    ...jumpstartDbSslConfig(data),
  };

  return {
    name: 'jumpstartDb',
    type: 'postgres',
    ...connectionParams,
    synchronize: false,
    uuidExtension: 'pgcrypto',
    migrationsRun: false,
    migrationsTransactionMode: 'all',
    logging: data.ORM_LOGGING || false,
    keepConnectionAlive: true,
  };
}

function fetchConnectionOptions(type: string): TypeOrmModuleOptions {
  const data = getEnvVars();
  switch (type) {
    case 'postgres':
      return buildConnectionOptions(data);
    case 'jumpstartDb':
      return buildJumpStartDbConnectionOptions(data);
  }
}

const ormconfig: TypeOrmModuleOptions = fetchConnectionOptions('postgres');
const jumpstartDbOrmconfig: TypeOrmModuleOptions = fetchConnectionOptions('jumpstartDb');

export { ormconfig, jumpstartDbOrmconfig };
export default ormconfig;
