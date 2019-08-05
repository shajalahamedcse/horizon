import axios from 'axios';
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
    postUser(auth,config);

};

const postUser = async (auth,config) =>{
    let res = await axios.post('/v3/auth/tokens',auth,config);
    let token = res.headers['x-subject-token'];
    console.log(token);
};
export default login;