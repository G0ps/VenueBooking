
import Headingkarpagam from './Headingkarpagam'
import Venues from './Venues'
import Blocks from './Blocks'
import Profile from './Profile'
function App() {

  
  return (
    <>
      <div className='d-flex '>
         <div className="vh-100 w-20"><Profile /></div>
         <div className='w-100'>
            <div className='heading'><Headingkarpagam /></div>
            <div className=' venue' ><Venues /></div>
            <Blocks />
         </div>
      </div>
    </>
  )
}
// {"status" : "success" , "content" : "hello world`"}

export default App