import { useState } from 'preact/hooks';
import { IconX } from '@tabler/icons-preact';

export default function InitForm({close}) {

  const [userName, setUserName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [workDirection, setWorkDirection] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const guardarDatos = (e) => {
    e.preventDefault()
    const datos = { userName, companyName, phoneNumber, emailAddress, workDirection };
    localStorage.setItem('userData', JSON.stringify(datos));
    close(false)
    console.log(JSON.parse(localStorage.getItem('userData')));
};

  return(
    <div className="absolute inset-0 m-auto w-1/2 h-2/3 bg-white shadow-xl border-2 border-gray-300 rounded-xl">
      <form className="p-6 flex flex-col gap-4 relative" onSubmit={guardarDatos}>
        <IconX onClick={() => close(false)} className='absolute right-6 cursor-pointer hover:text-red-500 transition-colors' />
        <h2 className="text-3xl pb-5 font-bold text-center">Welcome!<br></br> Please enter your basic info</h2>
        <div className="flex flex-col">
          <label className="font-bold text-xl pb-1" htmlFor="userName">Full Name</label>
          <input
          required 
          className="border rounded-lg h-10 px-2" 
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder='Your Full Name'
          />
        </div>
        <div className="flex flex-col">
          <label className="font-bold text-xl pb-1" htmlFor="companyName">Company Name</label>
          <input
          required 
          className="border rounded-lg h-10 px-2" 
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder='Your Company Name'
          />
        </div>
        <div className="flex flex-col">
          <label className="font-bold text-xl pb-1" htmlFor="workDirection">Work Address</label>
          <input
          required 
          className="border rounded-lg h-10 px-2" 
          type="text" 
          value={workDirection}
          onChange={(e) => setWorkDirection(e.target.value)}
          placeholder='Your Work Address'
          />
        </div>
        <div className="flex flex-col">
          <label className="font-bold text-xl pb-1" htmlFor="emailAddress">Mail</label>
          <input
          required 
          className="border rounded-lg h-10 px-2" 
          type="email" 
          value={emailAddress}
          onChange={(e) => setEmailAddress(e.target.value)}
          placeholder='abcdefghijk@gmail.com'
          />
        </div>
        <div className="flex flex-col">
          <label className="font-bold text-xl pb-1" htmlFor="phoneNumber">Phone Number</label>
          <input
          required 
          className="border rounded-lg h-10 px-2" 
          type="tel" 
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder='+ 555 555 555'
          />
        </div>
        <button type='submit' className="bg-blue-500 hover:bg-blue-400 transition-colors text-2xl font-bold text-white rounded-2xl p-4 mt-2">Ready For Create A Invoice</button>
      </form>
    </div>
  )
}