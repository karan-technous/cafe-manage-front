export const setLocaStorage = (name: string, token: string) => {
    localStorage.setItem(name, token);
}

export const getLocalStorage = (name: string) => {
    return localStorage.getItem(name);
}

export const removeLocalStorage=(name:string)=>{
    localStorage.removeItem(name);
}

export const TOKEN_NAME = "token";
export const EMAIL_NAME = "email";