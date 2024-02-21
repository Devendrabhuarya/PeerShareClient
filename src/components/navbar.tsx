import logo from '@/images/logo.png';
import LogoutIcon from '@mui/icons-material/Logout';

export default function NavBar() {
    return (
        <div className="navbar flex justify-between pt-10 pb-6 px-20 border-b-2 border-secendary md:px-6">
            <div className="logo">
                <img src={logo.src} alt="" className='w-56 md:w-20' />
            </div>
            <div className="profile flex justify-center items-center text-center">
                <span className="username text-2xl font-bold font-secondary mr-3 md:text-sm">Welcome devendra</span>
                <LogoutIcon className='cursor-pointer text-4xl md:text-2xl' />
            </div>
        </div>
    );
}