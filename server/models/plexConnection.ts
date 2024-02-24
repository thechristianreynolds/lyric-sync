import { Document, Schema, model } from "mongoose";

interface IPlexConnection {
    hostUrl: string,
    hostToken: string
}

const plexConnectionSchema = new Schema<IPlexConnection>(
    {
        hostUrl: { type: String, required: true },
        hostToken: { type: String, required: true }
    },
    {
        timestamps: true
    }
);

const PlexConnection = model('PlexConnection', plexConnectionSchema);
export default PlexConnection;