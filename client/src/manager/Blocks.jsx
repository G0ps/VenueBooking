import React from 'react'
import Card from './Card'
function Blocks() {
  return (
    <div>
      <div className='m-3 d-flex flex-wrap justify-content-center gap-3'>
        {
          Array.from({ length: 100 }).map((_, index) => (
            <Card key={index} />
          ))
        }
      </div>
    </div>
  )
}

export default Blocks