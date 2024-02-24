import React, { ChangeEvent } from "react";
import PlexService from "../services/PlexService";

interface FormState {
    plexServerHost: string;
    plexAuthToken: string;
    saveDisabled: boolean;
}

class plexServerConnectionForm extends React.Component<{}, FormState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            plexServerHost: '',
            plexAuthToken: '',
            saveDisabled: true
        }
    }

    handleHostChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({
            plexServerHost: event.target.value,
            saveDisabled: true
        });
    };

    handleAuthChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({
            plexAuthToken: event.target.value,
            saveDisabled: true
        });
    };

    onClickTest = () => {
        const { plexServerHost, plexAuthToken } = this.state;
        PlexService.tryConnection(plexServerHost, plexAuthToken)
            .then((response: any) => {
                console.log(response.data)
                if (response.status == 200 && response.data.MediaContainer) {
                    console.log(response.data.MediaContainer)
                    this.setState({
                        saveDisabled: false
                    });
                } else {
                    console.log("Could not connect to Plex Server with provided details");
                }
            });
    };

    onClickSave = () => {
        const { plexServerHost, plexAuthToken } = this.state;
        PlexService.setConnection(plexServerHost, plexAuthToken)
            .then((response: any) => {
                if (response.status == 200) {
                    console.log(response.data);
                } else {
                    console.log("Could not save Plex Connection details to database");
                }
            });
    };

    componentDidMount = () =>{
        PlexService.getConnection()
            .then((response: any) => {
                console.log(response.data)
                if (response.status == 200 && response.data.plexConnection != null) {
                    this.setState({
                        plexServerHost: response.data.plexConnection.hostUrl,
                        plexAuthToken: response.data.plexConnection.hostToken
                    });
                } else {
                    console.log("Could not get Plex Connection information from the database");
                }
            });
    };

    render() {
        return(
            <div className="grid h-screen place-items-center">
                <div className="card card-compact w-96 bg-base-100 shadow-xl pt-6">
                <div className="card-body">
                <label className="input input-bordered flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" /></svg>
                    <input type="text" className="grow" placeholder="Plex Server Host" value={this.state.plexServerHost} onChange={this.handleHostChange}/>
                </label>
                <label className="input input-bordered flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" /></svg>
                    <input type="text" className="grow" placeholder="Plex Auth Token" value={this.state.plexAuthToken} onChange={this.handleAuthChange}/>
                </label>
                    <div className="card-actions justify-end">
                        <button className="btn btn-primary" onClick={this.onClickTest}>Test</button>
                        <button className="btn btn-primary" disabled={this.state.saveDisabled} onClick={this.onClickSave}>Save</button>
                    </div>
                </div>
            </div>
            </div>
        );
    }
};

export default plexServerConnectionForm;