import axios from "axios";

const tryConnection = (url: string, token: string) => {
    return axios.get(`${url}/library/sections/?X-Plex-Token=${token}`)
};

const setConnection = (url: string, token: string) => {
    const data = {
        'url': url,
        'token': token
    };
    return axios.post('http://localhost:3000/api/v1/plex/connection', data);
};

const getConnection = () => {
    return axios.get('http://localhost:3000/api/v1/plex/connection');
};

const getSectionArtists = (url: string, token: string, sectionKey: string) => {
    return axios.get(`${url}/library/sections/${sectionKey}/all?X-Plex-Token=${token}`);
};

const getArtistAlbums = (url: string, token: string, sectionKey: string, artistKey: string) => {
    return axios.get(`${url}/library/sections/${sectionKey}/all?artist.id=${artistKey}&type=9&X-Plex-Token=${token}`);
};

const getAlbumTracks = (url: string, token: string, albumKey: string) => {
    return axios.get(`${url}/library/metadata/${albumKey}/children?X-Plex-Token=${token}`);
};

const PlexService = {
    tryConnection,
    setConnection,
    getConnection,
    getSectionArtists,
    getArtistAlbums,
    getAlbumTracks
}

export default PlexService;