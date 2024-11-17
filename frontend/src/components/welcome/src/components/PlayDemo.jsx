import { play } from "../assets";
import { useState } from 'react';

const PlayDemo = ({ className }) => {
  const [show, setShow] = useState(false);
  return (
    <>
    {show && (
      <div className="videocl">
        <video autoPlay src="https://ethglobal.b0bd725bc77a3ea7cd3826627d01fcb6.r2.cloudflarestorage.com/projects/gvj0t/videos/demo-qr.mov?X-Amz-Algorithm=AWS4-HMAC-SHA256&amp;X-Amz-Credential=dd28f7ba85ca3162a53d5c60b5f3dd05%2F20241117%2Fus-east-1%2Fs3%2Faws4_request&amp;X-Amz-Date=20241117T011255Z&amp;X-Amz-Expires=3600&amp;X-Amz-Signature=08775e26473c2ba149a54a12a2af2c78b2c52c3c9fe04015ca82982a6821aa50&amp;X-Amz-SignedHeaders=host" class="mt-8 rounded-lg" controls=""></video>
      </div>
    )}
    <div
      onClick={() => setShow(true)}
      style={{
        width: "180px",
        position: "absolute",
        top: "90px",
        backdropFilter: "blur(3px)"
      }}
      className={`flex items-center h-[3.5rem] px-6 bg-n-8/80 rounded-[1.7rem] ${
        className || ""
      } text-base`}
    >
      <img onClick={() => setShow(true)} className="w-5 h-5 mr-4" src={play} alt="Loading" />
        Play Demo
    </div>
    </>
  );
};

export default PlayDemo;
