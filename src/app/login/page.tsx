'use client';

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import illutration from '@/images/loginpage.png';
import Link from 'next/link';
import GoogleIcon from '@mui/icons-material/Google';
import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
export default function LoginPage() {
    const router = useRouter();
    const [inputData, setInputData] = useState({
        email: '',
        password: '',
    });
    const inputField = [
        {
            lable: 'E-mail address',
            id: 'email',
            placeholder: 'Enter your email'
        },
        {
            lable: 'Password',
            id: 'password',
            placeholder: 'Enter your password'
        }
    ];

    const handleOnChange = (e: any) => {
        setInputData({ ...inputData, [e.target.name]: e.target.value });
    }

    const handleOnSubmit = async () => {
        if (inputData.email === '' || inputData.password === '') {
            toast('Please fill the all field!', {
                icon: '🤓',
            });
            return false;
        }
        try {
            const response = await axios.post('/api/users/login', inputData);
            console.log(response);
            toast.success(response.data.message)
            router.push('/home');
            setInputData({
                email: '',
                password: '',
            });
        } catch (error: any) {
            toast.error(error.response.data.error);
            setInputData({
                email: '',
                password: '',
            });
        }
    }
    return (
        <div className='flex bg-primary  text-black px-40 pb-9 '>
            <div className="illutration  basis-6/12 border-r-4  border-secendary">
                <img src={illutration.src} alt=""
                    className='h-full m-6' />
            </div>
            <div className="signupfiled basis-6/12 flex flex-col items-center">
                <h1 className='text-7xl text-center font-tag font-bold mt-20'>Sign in</h1>
                <div className='mt-10'>
                    {inputField.map((val) => (
                        <>
                            <div className="inputs flex flex-col mt-3">
                                <label htmlFor={val.id} className=' font-serif font-light'>{val.lable}</label>
                                <input type="text" id={val.id} placeholder={val.placeholder}
                                    value={val.id === 'email' ? inputData.email : inputData.password}
                                    name={val.id}
                                    title='warning'
                                    className='h-16 bg-third  font-serif  border-2 focus:border-secendary  w-96 rounded-md'
                                    onChange={handleOnChange} />
                            </div>
                        </>
                    ))

                    }
                </div>

                <button className='px-20 mt-10  font-bold  py-2 rounded-3xl text-primary bg-secendary'
                    onClick={handleOnSubmit}>Log in</button>
                <div className="line w-full h-1 z-0 bg-secendary mt-20 flex justify-center ">
                    <span className='relative z-40 bottom-4  flex justify-center items-center m-auto  px-5 py-1 rounded-full bg-primary font-primary '>or</span>
                </div>
                <div className="sign-in-other-option mt-8 ">
                    <GoogleIcon className='text-4xl cursor-pointer' />
                </div>
                <Link href={'/signup'}>
                    <button className='px-3 text-2xl font-bold  capitalize mt-8 py-2 rounded-md text-primary bg-secendary font-secondary'>
                        Not have an account ? create
                        <ArrowForwardIcon className='ml-2 font-bold' />
                    </button>
                </Link>
            </div>
        </div>
    )
}