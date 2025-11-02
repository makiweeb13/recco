import HeaderMode from './HeaderMode';
import Footer from '../Footer';
import { Outlet } from 'react-router-dom'

function UserDashboard() {
    return (
        <>
            <HeaderMode />
            <Outlet />
            <Footer />
        </>
    )
}

export default UserDashboard;