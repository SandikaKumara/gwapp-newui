import React, { useState } from 'react'
import { AiOutlineNotification  } from "react-icons/ai";

function Announcement() {
    const [numberOfMessages, setNumberOfMessages] = useState(0);

  return (
    <div className='relative'>
        <AiOutlineNotification className="text-xl text-gray-800"/>

        <div className='absolute -top-3 -left-3 bg-cyan-700 rounded-full w-5 h-5 flex items-center justify-center text-gray-100 text-xs'>{numberOfMessages}</div>
    </div>
  )
}

export default Announcement