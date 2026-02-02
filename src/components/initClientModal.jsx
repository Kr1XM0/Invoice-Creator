import { useState } from 'preact/hooks';
import { IconX } from '@tabler/icons-preact';


export default function InitClientModal ({close, sendClientName}){
  const [clientName, setClientName] = useState("");
  const [clientWorkAddress, setClientWorkAddress] = useState("");


  console.log(clientName);
  

  const handleSubmit = (e) => {
    e.preventDefault()
    sendClientName(clientName, clientWorkAddress)
    close(false)
  }

  return(
    <div className="absolute inset-0 m-auto w-1/2 h-3/8 shadow-xl border-2 bg-white border-gray-300 rounded-xl">
      <IconX onClick={() => close(false)} className='absolute right-5 top-2 cursor-pointer hover:text-red-500 transition-colors' />
      <h2 className="text-center text-2xl font-bold mt-5">Enter your client's basic information</h2>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 relative">

          <div className='flex flex-col gap-1'>
            <label className='text-xl font-semibold' htmlFor="">Client Name</label>
            <input
            required 
            className="border rounded-lg h-10 px-2" 
            type="text"
            onChange={(e) => setClientName(e.target.value)}
            value={clientName}
            placeholder='Name'
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label className='text-xl font-semibold' htmlFor="">Client Work Address</label>
            <input
            required 
            className="border rounded-lg h-10 px-2" 
            type="text"
            onChange={(e) => setClientWorkAddress(e.target.value)}
            value={clientWorkAddress}
            placeholder='Work Address'
            />
          </div>
          <button type='submit' className="bg-blue-500 hover:bg-blue-400 transition-colors text-2xl font-bold text-white rounded-2xl p-4 mt-4">Ready For Create A Invoice!</button>
        </form>
      </div>

  )
}