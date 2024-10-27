import axios from 'axios';
import * as dotenv from 'dotenv'
dotenv.config()
console.log('process.env.WEBDAV_URL: ', process.env.WEBDAV_URL);
const WebDav = axios.create({
  baseURL: process.env.WEBDAV_URL,
  auth: {
    username: process.env.WEBDAV_USERNAME,
    password: process.env.WEBDAV_PASSWORD,
  },
});

export default WebDav;
