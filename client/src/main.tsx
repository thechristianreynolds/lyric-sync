import React from 'react'
import ReactDOM from 'react-dom/client'
import Root from "./routes/root.tsx"
import './index.css'
import './App.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import PlexServerConnection from './routes/plexServerConnection.tsx'
import LibrarySelecor from './routes/library.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "plexServerConnection",
        element: <PlexServerConnection />
      },
      {
        path: "library",
        element: <LibrarySelecor />
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
