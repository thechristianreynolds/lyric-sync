import React, { ChangeEvent } from "react";
import PlexService from "../services/PlexService";

interface AlbumProps {
    _key: string,
    title: string
}

const AlbumDropdowns: React.FC<ArtistProps> = (album) => {
    return (
        <div className="collapse bg-base-200">
            <input type="checkbox" key={album._key} />
            <div className="collapse-title">
                {album.title}
            </div>
            <div className="collapse-content">
            </div>
        </div>
    );
}

interface ArtistProps {
    state: any,
    _key: string,
    sectionKey: string,
    title: string
}

// {this.state.librarySectionResults.map((section: { key: string;  title: string; artists: any; }) => {
//     const { key, title } = section;
//     const sectionIndex = this.state.librarySectionResults.findIndex((section: { key: string; }) => section.key === key);
//     const dataExists = this.state.librarySectionResults[sectionIndex].artists !== undefined;
//     return (
//         <div className="collapse bg-base-200 grid grid-cols-4">
//             <input type="checkbox" key={key} onClick={() => !dataExists && this.getSectionArtists(key)}/> 
//             <div className="collapse-title text-xl font-medium">
//                 {title}
//             </div>
//             <div className="collapse-content"> 
//                 {dataExists && (
//                     this.state.librarySectionResults[sectionIndex].artists.map((artist: any) => {
//                         const { key, title } = artist;
//                         return (
//                             <ArtistDropdowns _key={key} title={title} sectionKey={key} state={this.state}/>
//                         )
//                     })
//                 )}
//             </div>
//         </div>
//     );
// })}

const ArtistDropdowns: React.FC<ArtistProps> = (artist) => {
    return (
        <div className="collapse bg-base-200">
            <input type="checkbox" key={artist._key} />
            <div className="collapse-title">
                {artist.title}
            </div>
            <div className="collapse-content">

            </div>
        </div>
    );
}

interface LibarySelectionState {
    librarySection: string,
    librarySectionResults: any
}

class plexServerConnectionForm extends React.Component<{}, LibarySelectionState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            librarySection: '',
            librarySectionResults: []
        }
    }

    handleSectionChange = (event: ChangeEvent<HTMLInputElement>) => {
        this.setState({
            librarySection: event.target.value,
        });
    };

    // onClickSave = () => {
    //     const { plexServerHost, plexAuthToken } = this.state;
    //     if ((localStorage.getItem("plexServerHost") == plexServerHost) && localStorage.getItem("plexAuthToken") == plexAuthToken) {
    //         console.log("Plex Connection data not updated. Please enter new values if you want to update the Plex Connection Data");
    //     } else {
    //         PlexService.setConnection(plexServerHost, plexAuthToken)
    //         .then((response: any) => {
    //             if (response.status == 200) {
    //                 console.log(response.data);
    //                 localStorage.setItem("plexServerHost", plexServerHost);
    //                 localStorage.setItem("plexAuthToken", plexAuthToken);
    //             } else {
    //                 console.log("Could not save Plex Connection details to database");
    //             }
    //         });
    //     }
    // };

    componentDidMount = () => {
        PlexService.tryConnection(localStorage.getItem("plexServerHost") as string, localStorage.getItem("plexAuthToken") as string)
            .then((response: any) => {
                if (response.status == 200) {
                    let sections = response.data.MediaContainer.Directory;
                    this.setState({
                        librarySectionResults: sections.filter((section: {
                            key: any;
                            title: any;
                            type: string;
                        }) => {
                            if (section.type === "artist") {
                                return section
                            }
                        })
                    });
                    console.log(this.state);
                } else {
                    console.log("Could not get Plex Connection information from the database");
                }
            });
    };

    getSectionArtists = (sectionKey: string) => {
        PlexService.getSectionArtists(localStorage.getItem("plexServerHost") as string, localStorage.getItem("plexAuthToken") as string, sectionKey)
            .then((response: any) => {
                if (response.status == 200) {
                    const artists = response.data.MediaContainer.Metadata;
                    const index = this.state.librarySectionResults.findIndex((section: { key: string; }) => section.key === sectionKey);
                    let newState = this.state.librarySectionResults;
                    newState[index].artists = artists;
                    this.setState({
                        librarySectionResults: newState
                    })
                    console.log(this.state)
                } else {
                    console.log("Could not get Plex Connection information from the database");
                }
            });
    }

    getArtistAlbums = (sectionKey: string, artistKey: string) => {
        const artistKeyArray = artistKey.split('/');
        const parsedArtistKey = artistKeyArray[artistKeyArray.length - 2];
        PlexService.getArtistAlbums(localStorage.getItem("plexServerHost") as string, localStorage.getItem("plexAuthToken") as string, sectionKey, parsedArtistKey)
            .then((response: any) => {
                if (response.status == 200) {
                    const albums = response.data.MediaContainer.Metadata;
                    const index = this.state.librarySectionResults.findIndex((section: { key: string; }) => section.key === sectionKey);
                    const artistIndex = this.state.librarySectionResults[index].artists.findIndex((artist: { key: string; }) => artist.key === artistKey);
                    let newState = this.state.librarySectionResults;
                    newState[index].artists[artistIndex].albums = albums;
                    this.setState({
                        librarySectionResults: newState
                    })
                    console.log(this.state)
                } else {
                    console.log("Could not get Plex Connection information from the database");
                }
            });
    }

    getAlbumTracks = (sectionKey: string, artistKey: string, albumKey: string) => {
        const albumKeyArray = albumKey.split('/');
        const parsedAlbumKey = albumKeyArray[albumKeyArray.length - 2];
        PlexService.getAlbumTracks(localStorage.getItem("plexServerHost") as string, localStorage.getItem("plexAuthToken") as string, parsedAlbumKey)
            .then((response: any) => {
                if (response.status == 200) {
                    const tracks = response.data.MediaContainer.Metadata;
                    const index = this.state.librarySectionResults.findIndex((section: { key: string; }) => section.key === sectionKey);
                    const artistIndex = this.state.librarySectionResults[index].artists.findIndex((artist: { key: string; }) => artist.key === artistKey);
                    const albumIndex = this.state.librarySectionResults[index].artists[artistIndex].albums.findIndex((album: { key: string }) => album.key === albumKey);
                    let newState = this.state.librarySectionResults;
                    newState[index].artists[artistIndex].albums[albumIndex].tracks = tracks;
                    this.setState({
                        librarySectionResults: newState
                    })
                    console.log(this.state)
                } else {
                    console.log("Could not get Plex Connection information from the database");
                }
            });
    }

    render() {
        return (
            <>
                {this.state.librarySectionResults.map((section: { key: string; title: string; artists: any; }) => {
                    const { key, title } = section;
                    const sectionIndex = this.state.librarySectionResults.findIndex((section: { key: string; }) => section.key === key);
                    const dataExists = this.state.librarySectionResults[sectionIndex].artists !== undefined;
                    return (
                        <div className="collapse bg-base-200 grid grid-cols-4">
                            <input type="checkbox" key={key} onClick={() => !dataExists && this.getSectionArtists(key)} />
                            <div className="collapse-title text-xl font-medium">
                                {title}
                            </div>
                            <div className="collapse-content">
                                {dataExists && (
                                    this.state.librarySectionResults[sectionIndex].artists.map((artist: any) => {
                                        const { key, title } = artist;
                                        const artistIndex = this.state.librarySectionResults[sectionIndex].artists.findIndex((artist: { key: string; }) => artist.key === key);
                                        const albumsExist = this.state.librarySectionResults[sectionIndex].artists[artistIndex].albums !== undefined;
                                        return (
                                            <div className="collapse bg-base-200">
                                                <input type="checkbox" key={key} onClick={() => !albumsExist && this.getArtistAlbums(section.key, key)} />
                                                <div className="collapse-title">
                                                    {title}
                                                </div>
                                                <div className="collapse-content">
                                                    {albumsExist && (
                                                        this.state.librarySectionResults[sectionIndex].artists[artistIndex].albums.map((album: any) => {
                                                            const { key, title } = album;
                                                            const albumIndex = this.state.librarySectionResults[sectionIndex].artists[artistIndex].albums.findIndex((album: { key: string }) => album.key === key);
                                                            const tracksExist = this.state.librarySectionResults[sectionIndex].artists[artistIndex].albums[albumIndex].tracks !== undefined;
                                                            return (
                                                                <div className="collapse bg-base-200">
                                                                    <input type="checkbox" key={key} onClick={() => !tracksExist && this.getAlbumTracks(section.key, artist.key, key)} />
                                                                    <div className="collapse-title">
                                                                        {title}
                                                                    </div>
                                                                    <div className="collapse-content">
                                                                        {tracksExist && (
                                                                            this.state.librarySectionResults[sectionIndex].artists[artistIndex].albums[albumIndex].tracks.map((track: any) => {
                                                                                return (
                                                                                    <div className="collapse bg-base-200">
                                                                                        <input type="checkbox" key={track.key} />
                                                                                        <div className="collapse-title">
                                                                                            {track.title}
                                                                                        </div>
                                                                                        <div className="collapse-content">

                                                                                        </div>
                                                                                    </div>
                                                                                )
                                                                            })
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    })
                                )}
                            </div>
                        </div>
                    );
                })}
            </>
        );
    }
};

export default plexServerConnectionForm;