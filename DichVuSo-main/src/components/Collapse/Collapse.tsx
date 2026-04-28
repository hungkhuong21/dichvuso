import React, { useEffect, useState } from 'react'

interface CollapseProps {
  title: string
  isOpen: boolean
  children: React.ReactNode
}

const Collapse: React.FC<CollapseProps> = ({ title, isOpen, children }) => {
  const [isOpenChildren, setIsOpenChildren] = useState<boolean>(true)

  useEffect(() => {
    setIsOpenChildren(!isOpen)
  }, [isOpen])

  const hanldOpenChildren = () => {
    setIsOpenChildren(!isOpenChildren)
  }

  return (
    <div className='w-full border border-red-800 my-2'>
      <button
        onClick={hanldOpenChildren}
        className='flex justify-start items-center w-full bg-red-800 text-white ps-2 py-1 gap-2'
      >
        {isOpenChildren ? (
          <span>
            <svg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 -960 960 960' width='24px' fill='#fff'>
              <path d='M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z' />
            </svg>
          </span>
        ) : (
          <span>
            <svg xmlns='http://www.w3.org/2000/svg' height='24px' viewBox='0 -960 960 960' width='24px' fill='#fff'>
              <path d='M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z' />
            </svg>
          </span>
        )}
        <div className='w-full text-center'>
          <span className='text-sm font-semibold'>{title.toUpperCase()}</span>
        </div>
      </button>
      {isOpenChildren && <div className='w-full p-4'>{children}</div>}
    </div>
  )
}

export default Collapse
