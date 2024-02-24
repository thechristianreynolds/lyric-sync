import { Hono } from "hono";
import plexController from "../controllers/plexController";

const plex = new Hono();

// get current plex connection data
plex.get('/connection', (c) => plexController.getPlexConnection(c));

plex.post('/connection', (c) => plexController.setPlexConnection(c));

export default plex;