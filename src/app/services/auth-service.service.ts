import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {Environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  baseUrl = Environment.apiBaseUrl
  constructor(private http: HttpClient) {
  }

  loginUser(data :any){
    console.log("the api=",this.baseUrl+"/login")
    return this.http.post(this.baseUrl + "/login",data,{
      headers:{
        'Content-Type':'Application/json'
      }
    });  
  }

  registerUser(data :any){
    return this.http.post(this.baseUrl + "/register",data);
  }
}
