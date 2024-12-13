import React from 'react'
import ChatMessage from './ChatMessage'

function Chatbox() {
  return (
    <div className='flex flex-col bg-green-400 w-full h-full'>
        {/* chat history */}
        <div className='w-full h-3/4 bg-red-400 p-4 flex flex-wrap items-end just'>
            <ChatMessage align={'left'} header={'Administrator [2024-01-01 14:00:00]'} message={'Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa voluptatum dignissimos repudiandae laudantium tempore delectus fugiat porro, omnis neque reprehenderit!'}/>
        </div>
        
      
    </div>
  )
}

export default Chatbox