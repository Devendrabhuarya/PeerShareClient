'use client';

import logo from '@/images/logo.png';
import LogoutIcon from '@mui/icons-material/Logout';
import VideocamIcon from '@mui/icons-material/Videocam';
import CallIcon from '@mui/icons-material/Call';
import { useState, useEffect, useCallback } from 'react';
import { useSocket } from '@/context/socketProvider';
import { ACTION } from '@/helper/action';
import peer from '@/helper/peer';
import ReactPlayer from "react-player";
import SendIcon from '@mui/icons-material/Send';

export default function RoomPage() {
    const socket = useSocket();
    const [remoteSocketId, setremoteSocketId] = useState<String | null>(null);
    const [myStream, setmyStream] = useState<MediaStream | undefined>();
    const [remoteStream, setremoteStream] = useState<MediaStream | undefined>();

    const handleUserJoin = useCallback(async ({ email, id }: any) => {
        console.log(`${email} has join the room her id is ${id}`);
        setremoteSocketId(id);
    }, []);

    const handleCallUser = useCallback(async () => {
        console.log('Handle Call User', remoteSocketId);
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
        });
        setmyStream(stream);
        const offer = await peer.getOffer();
        socket?.emit(ACTION.USER_CALL, { to: remoteSocketId, offer });
    }, [socket, myStream, remoteSocketId]);

    const handleIncomingCall = useCallback(async ({ from, offer }: any) => {
        console.log(`offer from ${from} , ${offer}`);
        setremoteSocketId(from);
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
        });
        setmyStream(stream);
        const ans = await peer.getAns(offer);
        socket?.emit(ACTION.CALL_ACCEPTED, { to: from, ans });
    }, [myStream, remoteSocketId]);

    const handleCallAccepted = useCallback(async ({ from, ans }: any) => {
        console.log(`Call Accepted from  ${from} , ${ans}`);
        await peer.setRemoteDescription(ans);
    }, [socket]);

    const handleNegoNeeded = useCallback(async () => {
        const offer = await peer.getOffer();
        socket?.emit("peer:nego:needed", { offer, to: remoteSocketId });
    }, [remoteSocketId, socket]);

    useEffect(() => {
        peer?.peer?.addEventListener("negotiationneeded", handleNegoNeeded);
        return () => {
            peer?.peer?.removeEventListener("negotiationneeded", handleNegoNeeded);
        };
    }, [handleNegoNeeded]);

    const handleNegoNeedIncomming = useCallback(
        async ({ from, offer }: any) => {
            const ans = await peer.getAns(offer);
            socket?.emit("peer:nego:done", { to: from, ans });
        },
        [socket]
    );

    const handleNegoNeedFinal = useCallback(async ({ ans }: any) => {
        await peer.setRemoteDescription(ans);
    }, []);

    useEffect(() => {
        socket?.on(ACTION.USER_JOIN, handleUserJoin);
        socket?.on(ACTION.INCOMING_CALL, handleIncomingCall);
        socket?.on(ACTION.CALL_ACCEPTED, handleCallAccepted);
        socket?.on("peer:nego:needed", handleNegoNeedIncomming);
        socket?.on("peer:nego:final", handleNegoNeedFinal);
        return () => {
            socket?.off(ACTION.USER_JOIN, handleUserJoin);
            socket?.off(ACTION.INCOMING_CALL, handleIncomingCall);
            socket?.off(ACTION.CALL_ACCEPTED, handleCallAccepted);
            socket?.off("peer:nego:needed", handleNegoNeedIncomming);
            socket?.off("peer:nego:final", handleNegoNeedFinal);
        };
    }, [socket, handleIncomingCall, handleUserJoin, handleCallAccepted]);


    const sendStreams = useCallback(() => {
        if (myStream) {
            // Get the list of senders
            let senders = peer.peer.getSenders();
            for (const track of myStream.getTracks()) {
                console.log(track);

                // Check if the track already has a sender
                let sender = senders.find((s: { track: { id: string; }; }) => s.track?.id === track?.id);
                if (sender) {
                    // Remove the existing sender
                    peer.peer.removeTrack(sender);
                }
                // Add the track to the peer connection
                peer.peer.addTrack(track, myStream);
            }
        }
    }, [myStream, remoteStream]);

    useEffect(() => {
        peer?.peer?.addEventListener("track", async (ev: any) => {
            const remoteStream = ev.streams;
            console.log("GOT TRACKS!!", remoteStream);
            setremoteStream(remoteStream[0]);
        });
    }, [remoteStream, myStream]);
    useEffect(() => {
        peer?.peer?.addEventListener("track", async (ev: any) => {
            const remoteStream = ev.streams;
            console.log("GOT TRACKS!!", remoteStream);
            setremoteStream(remoteStream[0]);
        });
    }, []);

    return (

        <div className='h-screen bg-primary text-secendary relative'>
            <div className="navbar flex justify-between pt-10 pb-6 px-20 border-b-2 border-secendary md:px-6">
                <div className="logo">
                    <img src={logo.src} alt="" className='w-56 md:w-20' />
                </div>
                <div className="profile flex justify-center items-center text-center">
                    <span className="username text-2xl font-bold font-secondary mr-3 md:text-sm">Welcome devendra</span>
                    <LogoutIcon className='cursor-pointer text-4xl md:text-2xl' />
                </div>
            </div>

            <div className="room flex relative  pt-10 pb-6 px-20 border-b-2 border-secendary
            h-4/5 gap-6 md:px-2 md:pt-3 md:flex-col">
                <div className="video basis-8/12 relative">
                    <div className="remoteUserVideo h-96 bg-third relative overflow-hidde">
                        <ReactPlayer
                            playing
                            width='100%'
                            height='100%'
                            url={remoteStream}
                        />
                        <div className="UserVideo absolute h-28 w-20  bg-secendary right-0 bottom-0">
                            <ReactPlayer
                                playing
                                muted
                                url={myStream}
                                width='100%'
                                height='100%'
                            />
                        </div>
                    </div>

                    <div className="handler flex text-center items-center justify-center">

                        {remoteSocketId && <button onClick={handleCallUser}> <span className='p-3  m-2 flex justify-center item-center text-center bg-third rounded-full'> <CallIcon className='cursor-pointer text-4xl bg-thirdrounded-full' /></span></button>}
                        {remoteSocketId && <button onClick={sendStreams}> <span className='p-3  m-2 flex justify-center item-center text-center bg-third rounded-full'> <VideocamIcon className='cursor-pointer text-4xl bg-thirdrounded-full' /></span></button>}
                    </div>
                </div>
                <div className="text flex bg-third h-full w-full bg-red basis-4/12">
                    <div className="input h-14 flex mt-auto w-full px-1 bg-secendary overflow-hidden "
                    >
                        <input type="text"
                            placeholder='type something'
                            className='bg-secendary text-primary h-full w-full'
                        />
                        <button className=''><SendIcon className='text-primary' /></button>
                    </div>
                </div>
            </div>

        </div>
    )
}