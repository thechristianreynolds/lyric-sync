import axios, { AxiosError } from 'axios';
import { Context } from "hono";

export default {
    getLyrics: async (c: Context) => {
        const lyricsRequest = await c.req.json();

        // query lrc
        try {
            const { data } = await axios.get(`https://lrclib.net/api/get?` +
            `artist_name=${encodeURI(lyricsRequest.artist_name)}&` +
            `track_name=${encodeURI(lyricsRequest.track_name)}&` +
            `album_name=${encodeURI(lyricsRequest.album_name)}&` +
            `duration=${encodeURI(lyricsRequest.duration)}`);

            return c.json(data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return c.json(error.response?.data);
            }
        }
    }
};