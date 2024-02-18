'use client';
import logo from '@/images/logo.png';
import LogoutIcon from '@mui/icons-material/Logout';
import JoinConnectionModel from '@/compoent/joinConnectionModel';
import CreateConnectionModel from '@/compoent/createConnectionModel';
import { useState } from 'react';

export default function HomePage() {
    const [showJoinModel, setShowJoinModel] = useState<boolean>(false);
    const [showCreateModel, setShowCreateModel] = useState<boolean>(false);
    const roomButton = 'px-7 py-3 font-secondary text-xl rounded-xl bg-third  hover:bg-slate-700';
    return (
        <div className='h-screen bg-primary text-secendary relative'>
            <div className="navbar flex justify-between pt-10 pb-6 px-20 border-b-2 border-secendary">
                <div className="logo">
                    <img src={logo.src} alt="" className='w-56' />
                </div>
                <div className="profile flex justify-center items-center text-center">
                    <span className="username text-2xl font-bold font-secondary mr-3">Welcome devendra</span>
                    <LogoutIcon className='cursor-pointer text-4xl' />
                </div>
            </div>
            <div className="hall flex justify-between mx-20 mt-5">
                <button className={roomButton} onClick={() => {
                    setShowJoinModel(true);
                }}>join connection</button>
                <button className={roomButton} onClick={() => {
                    setShowCreateModel(true);
                }}>create connection</button>
            </div>

            <div className="aboutme mx-20 py-20 pt-6   bg-third mt-28 px-80  text-xl font-secondary text-center">
                <p className='pt-5'>Hello <span className='font-bold'> User_Name</span></p>
                <p className='mt-10'>
                    Hello, my name is <span className='font-bold'>Devendra kumar bhuarya</span>, and I am a web developer .
                    I have a passion for building user-friendly, responsive, and modern
                    websites that meet the needs and expectations of my clients.
                </p>
            </div>
            {showJoinModel && <JoinConnectionModel setShowModel={() => {
                setShowJoinModel(false);
            }} />}
            {showCreateModel && <CreateConnectionModel setShowModel={() => {
                setShowCreateModel(false);
            }} />}
        </div>
    )
}