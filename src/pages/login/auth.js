import axios from 'axios';
import {parseURLPrefix, combineIdentityURL, combineURL} from '../../commons/commons';
function login(values) {

        console.log(values);
        fetchUnscopedToken( values);

}

// Get temporary Token
const fetchUnscopedToken = (values) =>{
    const auth = {
        "auth": {
            "identity": {
                "methods": [
                    "password"
                ],
                "password": {
                    "user": {
                        "name": values.email,
                        "domain": {
                            "name": "Default"
                        },
                        "password": values.password
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

    requestForUnscopedToken(auth,config)
        .then()
        .catch(err=>{console.log(err)})

};

const requestForUnscopedToken = async (auth,config) =>{
    let token;
    try {
        let res = await axios.post('/v3/auth/tokens', auth, config);
        //console.log(res);
        if (res.status === 201){
            // test for status you want, etc
            token = res.headers['x-subject-token'];

            getOwnProjects(res,token)
                .then()
                .catch(err=>{console.log(err)});
            //console.log(token)
            return token;
        }
        // Don't forget to return something

    }
    catch (err) {
        console.error(err);
    }

    //console.log(token);
};


// Get all the projects to which the user belongs
const getOwnProjects = async (userData,token) => {
    const userId = userData.data.token.user['id'];
    const tmpl = {'user_id': userId};
    const unScopedToken = token;
    let projectURL = combineIdentityURL('getOwnProjects', tmpl);
    console.log(projectURL);
    console.log(tmpl);
    const header = {
        headers:{
            "X-Auth-Token": unScopedToken
        }
    };
    try {
        let res = await axios.get('/v3/users/'+userId+'/projects' , header);
        //console.log(res.data.projects[0].id);
        fetchScopedToken(unScopedToken,res)
    }catch (e) {
        console.log(e);
    }

};


const fetchScopedToken = async (unScopedToken,res)=>{
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
                    "id": res.data.projects[0].id
                }
            }
        }
    };

    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };

    try {
        let res = await axios.post('/v3/auth/tokens', auth, config);

        let urlPrefix= await parseURLPrefix(res.data);
        //console.log(urlPrefix);
        await localStorage.setItem('urlPrefix',JSON.stringify(urlPrefix));
        //console.log(res.data.token.project.id);
        await localStorage.setItem('projectID',res.data.token.project.id);
        //console.log(res.data.token.expires_at);
        await localStorage.setItem('expires_at',res.data.token.expires_at);
        //console.log(res.headers['x-subject-token']);
        await localStorage.setItem('scopedToken',res.headers['x-subject-token']);
        console.log("Log In Successfull");
    }catch (e) {
        console.log(e)
    }
    //console.log(auth);

};





export default login;