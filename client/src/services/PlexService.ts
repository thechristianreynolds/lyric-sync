import axios from "axios";

const tryConnection = (url: String, token: String) => {
    return axios.get(`${url}/library/sections/?X-Plex-Token=${token}`)
};

const setConnection = (url: String, token: String) => {
    const data = {
        'url': url,
        'token': token
    };
    return axios.post('http://localhost:3000/api/v1/plex/connection', data);
};

const getConnection = () => {
    return axios.get('http://localhost:3000/api/v1/plex/connection');
};

const PlexService = {
    tryConnection,
    setConnection,
    getConnection
}

export default PlexService;