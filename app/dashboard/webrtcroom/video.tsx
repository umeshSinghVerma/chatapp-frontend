import React, { useEffect, useRef } from 'react';

interface VideoProps {
    stream: MediaStream | null;
    isLocalStream: boolean;
}



const Video: React.FC<VideoProps> = ({ stream, isLocalStream }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
console.log("stream  ",stream)
    useEffect(() => {
        console.log("videoref.current first checker   ",videoRef.current)
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        console.log("videoref.current.srcobject first checker   ",videoRef.current.srcObject)

        videoRef.current.onloadedmetadata = () => {
            console.log("videoref.current is  ",videoRef.current)
            videoRef.current?.play();
            
        }
        console.log(videoRef.current ,videoRef.current.onloadedmetadata )

        }
    }, [stream]);

    return (
        <div style={{ height: '50%', width: '50%', backgroundColor: 'black', borderRadius: '8px' }}>
            <video style={{ width: '100%', height: '100%' }} autoPlay muted={isLocalStream ? true : false} ref={videoRef} ></video>
        </div >
    );
};

export default Video;
