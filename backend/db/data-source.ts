import { DataSourceOptions ,DataSource} from "typeorm";
import * as dotenv from 'dotenv'
dotenv.config()
export const dataSourceOptions :DataSourceOptions = {
    type: "mysql",
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT as any,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database:process.env.DATABASE_NAME,
    entities: ['dist/**/*.entity.js'],
    migrations: ['dist/db/migrations/*.js'],
<<<<<<< HEAD
    synchronize:true,
    timezone: 'Z', // Set to UTC+7 for Ho Chi Minh City
=======
    synchronize:false,
    // timezone: '+7:00', // Set to UTC+7 for Ho Chi Minh City
>>>>>>> bfb37031fab4fda870544091c5a2ce9c847ee392
} 

console.log('dataSourceOptions: ', dataSourceOptions);
const dataSource = new DataSource(dataSourceOptions);
export default dataSource;