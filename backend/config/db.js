import pkg from 'pg';
const { Pool } = pkg;

const userPool = new Pool({
  user: 'postgres',
  password: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'postgres'
});


export default userPool;