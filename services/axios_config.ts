import { AxiosRequestConfig } from 'axios';

export const axiosRequestConfiguration: AxiosRequestConfig = {
    baseURL: 'https://herogamesimple-703c.restdb.io/rest/',
    responseType: 'json',
    headers: {
        'Content-Type': 'application/json',
        'x-apikey': '613f22c143cedb6d1f97f01b',
    },
};