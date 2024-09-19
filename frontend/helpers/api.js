import axios from "axios";

export default function requestApi(endpoint ,method,body,responseType = 'json') {
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
      

    return instance.request({
        method:method,
        url:`http://localhost:2070/${endpoint}`,
        data:body,
        responseType:responseType
    })
}

/// wrong