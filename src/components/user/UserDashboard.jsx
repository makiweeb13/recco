import HeaderMode from './HeaderMode';
import Footer from '../Footer';
import { Outlet } from 'react-router-dom'
import useSocket from '../../util/useSocket';

function UserDashboard() {
    useSocket();

    return (
        <>
            <HeaderMode />
            <Outlet />
            <Footer />
        </>
    )
}

export default UserDashboard;