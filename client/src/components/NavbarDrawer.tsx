import { Link } from "react-router-dom";

export default function() {
    return(
        <div className="drawer">
            <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content">
                {/*Page content here*/}
                <label htmlFor="my-drawer-4" className="drawer-button btn btn-square btn-ghost">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                </label>
            </div> 
            <div className="drawer-side z-10">
                <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
                    {/*Page content here*/}
                    <li><Link to={`/plexServerConnection`}>Plex Server Connection</Link></li>
                    <li><a>Sidebar Item 2</a></li>
                </ul>
            </div>
        </div>
    );
}