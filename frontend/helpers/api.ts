import { _ENV } from "@/contstants";
import axios from "axios";

export default function requestApi(endpoint:any ,method:any,body:any,responseType = 'json') {
    let URL = '';
    const headers = {
        "Accept":"application/json",
        "Content-Type":"application/json",
        "Access-Control-Allow-Origin":"*"
    }
    const instance = axios.create({headers});

    instance.interceptors.request.use(
        (config) => {
        //   const authStore = encryptStorage.getItem("auth");
        //   if (authStore) {
        //     if (authStore.accessToken) {
        //       config.headers["Authorization"] = "Bearer " + authStore.accessToken;
        //     }
        //   }
      
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      );
      
      instance.interceptors.response.use(
        (config) => {
          return config?.data || { success: false, statusCode: 401 };
        },
        (error) => {
          console.log(error);
          return { success: false };
        }
      );

      if(process.env.NODE_ENV == 'development'){
        URL = _ENV.NEXT_URL_LOCAL
      }else{
        URL = _ENV.NEXT_URL_PRODUCTION
      }
      
    return instance.request({
        method:method,
        url:`${URL}/${endpoint}`,
        data:body,
        responseType:responseType as any
    })
}

/// wrong