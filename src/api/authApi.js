import axios from "axios";

const AUTH_BASE_URL = "http://103.248.13.91:5000";
const USER_TOKEN_URL ="/v3/auth/tokens";


class AuthApi {

    static userLogin = (data, callback) =>{

        const url = USER_TOKEN_URL;
        let apiResponse = {response: null, error: false, msg: ''};
        let unscopedToken = fetchUnscopedToken(url,data, apiResponse,callback);

    }
}

// Get temporary Token
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

const getOwnProjects = (apiResponse,token,callback) => {
    const userId = apiResponse.response.data.token.user['id'];
    const header = {
        headers:{
            "X-Auth-Token": token
        }
    };
    axios.get('/v3/users/'+userId+'/projects' , header)
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

const fetchScopedToken = (apiResponse,unScopedToken,callback)=> {

    console.log(apiResponse.response.data.projects[0].id);
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

    axios.post('/v3/auth/tokens', auth, config)
        .then(
            response =>{
                //console.log(response);
                apiResponse.response=response;
                callback(apiResponse);
            }
        )
        .catch(

        )
};

export default AuthApi;
