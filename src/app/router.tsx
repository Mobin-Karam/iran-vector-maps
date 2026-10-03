import { Navigate, createBrowserRouter } from 'react-router-dom'
import { IranMap } from '../features/iran-map/components/IranMap'
import { AboutPage } from '../pages/AboutPage'
import { PackagePage } from '../pages/PackagePage'
import { HomePage } from '../pages/HomePage'
import { StudioRoute } from '../pages/StudioRoute'
export const router = createBrowserRouter([{ path: '/', element: <HomePage /> }, { path: '/map', element: <IranMap /> }, { path: '/map/province/:provinceId', element: <IranMap /> }, { path: '/map/province/:provinceId/county/:countyId', element: <IranMap /> }, { path: '/studio', element: <StudioRoute /> }, { path: '/about', element: <AboutPage /> }, { path: '/package', element: <PackagePage /> }, { path: '*', element: <Navigate to="/" replace /> }], { basename: import.meta.env.BASE_URL })
