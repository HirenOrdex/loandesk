import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import { Outlet } from 'react-router-dom'
import BackToTopButton from '../../components/BackToTopButton'

const ProtectedLayout = () => {
    return (
        <>
            <Header />
            <Outlet />
            <BackToTopButton />
            <Footer />
        </>
    )
}

export default ProtectedLayout