import { ModeToggle } from '@/components/Toggle-theme-change'
import React from 'react'

const Home = () => {
  return (
    <div className='w-full min-h-screen flex flex-col justify-center items-center' >
        <p className='text-3xl font-bold' >
            Home screen
        </p>
        <p className='text-3xl font-bold flex-col flex' >
            change the appearance
            <ModeToggle />
        </p>
      
    </div>
  )
}

export default Home
