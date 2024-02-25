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
        if (!(localStorage.getItem("plexServerHost") == plexServerHost) && !localStorage.getItem("plexAuthToken") == plexAuthToken) {
            console.log("Plex Connection data not tested as it did not change.");
            this.setState({
                saveDisabled: false
            });
        } else {
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
        }
    };

    onClickSave = () => {
        const { plexServerHost, plexAuthToken } = this.state;
        if ((localStorage.getItem("plexServerHost") == plexServerHost) && localStorage.getItem("plexAuthToken") == plexAuthToken) {
            console.log("Plex Connection data not updated. Please enter new values if you want to update the Plex Connection Data");
        } else {
            PlexService.setConnection(plexServerHost, plexAuthToken)
            .then((response: any) => {
                if (response.status == 200) {
                    console.log(response.data);
                    localStorage.setItem("plexServerHost", plexServerHost);
                    localStorage.setItem("plexAuthToken", plexAuthToken);
                } else {
                    console.log("Could not save Plex Connection details to database");
                }
            });
        }
    };

    componentDidMount = () =>{
        if (localStorage.getItem("plexServerHost") && (localStorage.getItem("plexAuthToken"))) {
            this.setState({
                plexServerHost: localStorage.getItem("plexServerHost") as string,
                plexAuthToken: localStorage.getItem("plexAuthToken") as string
            });
            console.log("Retrieved plex connection data from local storage");
        } else {
            PlexService.getConnection()
            .then((response: any) => {
                console.log(response.data)
                if (response.status == 200 && response.data.plexConnection != null) {
                    this.setState({
                        plexServerHost: response.data.plexConnection.hostUrl,
                        plexAuthToken: response.data.plexConnection.hostToken
                    });
                    localStorage.setItem("plexServerHost", response.data.plexConnection.hostUrl);
                    localStorage.setItem("plexAuthToken", response.data.plexConnection.hostToken);
                } else {
                    console.log("Could not get Plex Connection information from the database");
                }
            });
        }
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
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" /></svg>
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