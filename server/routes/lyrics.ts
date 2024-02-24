import { Hono } from 'hono';
import lyricsController from '../controllers/lyrics';

const lyrics = new Hono();

// Get lyrics for song
lyrics.post('/', (c) => lyricsController.getLyrics(c));

export default lyrics;