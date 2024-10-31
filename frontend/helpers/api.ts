import { _ENV, _GLOBAL } from "@/contstants";
import { logout, updateLocalStorage } from "@/stores/features/masterSlice";
import { makeStore } from "@/stores/store";
import axios from "axios";
import { useLocale } from "next-intl";
import { redirect } from "next/navigation";
import { useRouter } from "next/router";
import secureLocalStorage from "react-secure-storage";
import { NextResponse } from "next/server";
import { useAppSelector } from "@/stores/hookStore";
import { useActionState } from "react";
export default function requestApi(
  endpoint: any,
  method: any,
  body?: any,
  // page?: number,   // Add optional query parameters here
  responseType = "json",
  contentType = "application/json"
) {
  let URL_API = "";

  const isFormData = body instanceof FormData;

  // Cấu hình headers dựa trên loại nội dung
  const headers = {
    Accept: "application/json",
    "Access-Control-Allow-Origin": "*",
    ...(isFormData ? {} : { "Content-Type": contentType }),
  };
  // const headers = {
  //   Accept: "application/json",
    
  //   "Content-Type": contentType,
  //   "Access-Control-Allow-Origin": "*",
  // };
  const instance = axios.create({ headers });

  instance.interceptors.request.use(
    (config) => {
        const authStore = JSON.parse(
          secureLocalStorage.getItem(_GLOBAL.LOCAL_STOREAGE) as string
        );
        console.log("authStore: ", authStore);
        if (authStore) {
          if (authStore.access_token) {
            config.headers["Authorization"] = "Bearer " + authStore.access_token;
          }
        }

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
    async (error) => {
      if (error.response?.status === 401 || error.response?.status === 403) {
        const authStore = JSON.parse(
          secureLocalStorage.getItem(_GLOBAL.LOCAL_STOREAGE) as string
        );
        console.log('authStore: ', authStore);
        window.location.href = `/${authStore.lang}/${_GLOBAL.ROUTER_LOGIN}?action=logout`;
      }
      return { success: false };
    }
  );

  if (process.env.NODE_ENV == "development") {
    URL_API = _ENV.NEXT_URL_LOCAL;
  } else {
    URL_API = _ENV.NEXT_URL_PRODUCTION;
  }
  console.log({
    method: method,
    url: `${URL_API}/${endpoint}`,
    data: body,
    responseType: responseType as any,
    trang:''
  })
  return instance.request({
    method: method,
    url: `${URL_API}/${endpoint}`,
    // params: {page},  // Add the query parameters here
    data: body,
    responseType: responseType as any,
  });
  
}

/// wrong
