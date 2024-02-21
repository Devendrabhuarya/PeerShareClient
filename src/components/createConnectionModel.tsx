'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import CloseIcon from '@mui/icons-material/Close';
import { NextPage } from 'next';
import { useSocket } from '@/context/socketProvider';
import { ACTION } from '@/helper/action';

interface HomeProps {
    setShowModel: () => void; // Declare the type of your prop
}

const CreateConnectionModel: NextPage<HomeProps> = ({ setShowModel }) => {
    const socket = useSocket();
    const router = useRouter();
    const [remoteSocketId, setremoteSocketId] = useState<String | null>(null);
    const [myStream, setmyStream] = useState<MediaStream | undefined>();
    const [remoteStream, setremoteStream] = useState<MediaStream | undefined>();

    const [inputData, setInputData] = useState({
        name: '',
        roomId: '',
        roomType: 'chat'
    });
    const inputField = [
        {
            lable: 'Name',
            id: 'name',
            placeholder: 'Enter your name'
        },
        {
            lable: 'Room-Id',
            id: 'roomId',
            placeholder: 'Enter Room-Id'
        }
    ];

    const handleOnChange = (e: any) => {
        setInputData({ ...inputData, [e.target.name]: e.target.value });
    }

    const handleOnSubmit = async () => {
        if (inputData.name === '' || inputData.roomId === '') {
            toast('Please fill the all field!', {
                icon: '🤓',
            });
            return false;
        }
        socket?.emit(ACTION.ROOM_JOIN, { email: inputData.name, room: inputData.roomId, roomType: inputData.roomType });
    }
    const handleRoomJoin = ({ email, room, roomType, id }: any) => {
        console.log(email, room, roomType, id);
        if (roomType === 'chat')
            router.push(`/chatroom/${room}`);
        else
            router.push(`/room/${room}`);
    }
    useEffect(() => {
        socket?.on(ACTION.ROOM_JOIN, handleRoomJoin);
    }, [socket]);
    return (
        <div className='h-screen text-primary  top-0 w-full flex justify-center  items-center  '
            style={{ position: 'absolute', background: 'rgb(0,0,0,0.5)' }}>

            <div className='relative cursor-pointer bg-secendary rounded-3xl'>
                <span
                    onClick={setShowModel}
                    style={{
                        position: 'absolute', top: '5px', right: '8px',

                    }}
                >
                    <CloseIcon className='text-3xl' />
                </span>
                <div className='  px-10 py-8  rounded-3xl'
                    style={{ padding: '60px' }} >
                    {inputField.map((val, ind) => (
                        <div className="inputs flex flex-col mt-3 text-start" key={ind}>
                            <label htmlFor={val.id} className=' font-serif font-light'>{val.lable}</label>
                            <input type="text" id={val.id} placeholder={val.placeholder}
                                value={val.id === 'name' ? inputData.name : inputData.roomId}
                                name={val.id}
                                title='warning'
                                className='h-16 bg-third  font-serif text-secendary border-2 focus:border-secendary w-96 rounded-md md:w-64  md:h-10'
                                onChange={handleOnChange} />
                        </div>
                    ))

                    }
                    <div className="inputs flex flex-col mt-3 text-start" >
                        <label htmlFor='roomType' className='font-serif font-light'>Room-Type</label>
                        <select name='roomType' id="roomType"
                            className='h-16 bg-third  font-serif text-secendary border-2 focus:border-secendary   rounded-md md:w-64 md:h-10 '
                            onChange={handleOnChange}
                        >
                            <option value="chat">Chat</option>
                            <option value="voice">Voice</option>
                            <option value="video">Video</option>
                        </select>
                    </div>

                    <div className='text-center'>
                        <button className='px-20 mt-10 mx-auto md:px-10 font-bold  py-2 rounded-3xl text-secendary bg-primary'
                            onClick={handleOnSubmit}>Create Room</button>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default CreateConnectionModel;