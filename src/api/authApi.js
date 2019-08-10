import axios from "axios";
import { parseURLPrefix } from '../commons/commons';
const AUTH_BASE_URL = "/identity";
const USER_TOKEN_URL ="/v3/auth/tokens";


class AuthApi {

    static userLogin = (data, callback) =>{

        const url =AUTH_BASE_URL+USER_TOKEN_URL;
        let apiResponse = {response: null, error: false, msg: ''};
        fetchUnscopedToken(url,data, apiResponse,callback);

    }
}

//-------------------Get temporary Token-------------------------

const fetchUnscopedToken = (url,data,apiResponse,callback) => {
    const auth = {
        "auth": {
            "identity": {
                "methods": [
                    "password"
                ],
                "password": {
                    "user": {
                        "name": data.email,
                        "domain": {
                            "name": "Default"
                        },
                        "password": data.password
                    }
                }
            }
        }
    };

    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };

    axios.post(url,auth,config)
        .then(response => {
            apiResponse.response=response ;
            let unScopedToken = apiResponse.response.headers['x-subject-token'];
            getOwnProjects(apiResponse,unScopedToken,callback)
        })
        .catch(
            error =>{
                apiResponse.response = error;
                apiResponse.error = true;
                if (error.request.status === 404 || error.request.status === 401 || error.request.status === 422) {
                    apiResponse.msg = "Email or password is wrong";
                }
                callback(apiResponse)
            }
        )
};
//--------------------------------------------------------


//--------------Get own projects---------------------------

const getOwnProjects = (apiResponse,token,callback) => {
    const userId = apiResponse.response.data.token.user['id'];
    const header = {
        headers:{
            "X-Auth-Token": token
        }
    };
    const url = AUTH_BASE_URL+ '/v3/users/'+userId+'/projects';
    axios.get(url , header)
        .then(response => {
            apiResponse.response=response;
            fetchScopedToken(apiResponse,token,callback);
        })
        .catch(
            error =>{
                apiResponse.response = error;
                apiResponse.error = true;
                if (error.request.status === 404 || error.request.status === 401 || error.request.status === 422) {
                    apiResponse.msg = "UserId or Unscopped token is wrong";
                }
                callback(apiResponse);
            }
        )
};

//-------------------------------------------------------


//----------- Fetch Scoped Token -------------------------
const fetchScopedToken = (apiResponse,unScopedToken,callback)=> {

    //console.log(apiResponse.response.data.projects[0].id);
    const auth = {
        "auth": {
            "identity": {
                "methods": [
                    "token"
                ],
                "token": {
                    "id": unScopedToken
                }
            },
            "scope": {
                "project": {
                    "id": apiResponse.response.data.projects[0].id
                }
            }
        }
    };

    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    const url = AUTH_BASE_URL + USER_TOKEN_URL;
    axios.post(url, auth, config)
        .then(
            response =>{
                //console.log(response);
                let urlPrefix = parseURLPrefix(response.data);
                localStorage.setItem('urlPrefix',JSON.stringify(urlPrefix));
                localStorage.setItem('projectID', response.data.token.project.id);
                localStorage.setItem('scopedToken',response.headers['x-subject-token']);
                localStorage.setItem('expires_at', response.data.token.expires_at);
                apiResponse.response=response;

                callback(apiResponse);
            }
        )
        .catch(
            err =>{
                console.log(err);
            }
        )
};

export default AuthApi;
