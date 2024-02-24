import { Context } from "hono";
import { PlexConnection } from "../models";

export default {
    getPlexConnection: async (c: Context) => {
        const plexConnection = await PlexConnection.findOne();
        return c.json({ plexConnection });
    },
    setPlexConnection: async (c: Context) => {
        const { url, token } = await c.req.json()
        const plexConnectionExists = await PlexConnection.findOne();

        if (plexConnectionExists) {
            // entry exists in db so we update it
            plexConnectionExists.hostUrl = url;
            plexConnectionExists.hostToken = token;

            await plexConnectionExists.save();
            return c.json({
                success: true,
                data: {
                    hostUrl: url,
                    hostToken: token
                },
                message: 'Plex Connection updated successfully'
            });
        } else {
            const newPlexConnection = await PlexConnection.create({
                hostUrl: url,
                hostToken: token
            });

            if (!newPlexConnection) {
                c.status(400);
                throw new Error('Invalid Plex Connection data');
            } else {
                return c.json({
                    success: true,
                    data: {
                        hostUrl: url,
                        hostToken: token
                    },
                    message: 'Plex Connection set successfully'
                });
            }
        }
    }
};