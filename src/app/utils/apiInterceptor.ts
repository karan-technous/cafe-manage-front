import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import axios from "axios"
import { EMAIL_NAME, getLocalStorage, removeLocalStorage, TOKEN_NAME } from "./token";
import { Environment } from "../environments/environment";

@Injectable({
    providedIn: 'root',
})
export class AxiosService {
    private readonly instance = axios.create({
        baseURL: `${Environment.apiBaseUrl}/api`,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    constructor(private router: Router) {
        // Add interceptors
        this.instance.interceptors.request.use(
            (config) => {
                const token = getLocalStorage(TOKEN_NAME);
                if (token) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        this.instance.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response || error.response.data || error.response.data.message) {
                    console.warn("Unauthorized. Redirecting to login...");
                    console.log("the res++++", error.response.data.error.message)
                      removeLocalStorage(TOKEN_NAME); // clear stored token
                      removeLocalStorage(EMAIL_NAME); // clear stored token
                    this.router.navigate(['/login']);
                }
                return Promise.reject(error);
            }
        );
    }

    // ✅ Expose the axios instance for use elsewhere
    public getAxios() {
        return this.instance;
    }
}
