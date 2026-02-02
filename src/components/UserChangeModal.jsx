import { useState } from 'preact/hooks';
import { IconX } from '@tabler/icons-preact';

export default function UserChangeModal({close, oldUserData}) {
    const obj = oldUserData ?? ""
    
    const [userName, setUserName] = useState(obj.userName);
    const [companyName, setCompanyName] = useState(obj.companyName);
    const [workDirection, setWorkDirection] = useState(obj.workDirection);
    const [emailAddress, setEmailAddress] = useState(obj.emailAddress);
    const [phoneNumber, setPhoneNumber] = useState(obj.phoneNumber);
  
    const guardarDatos = () => {
      const datos = { userName, companyName, phoneNumber, emailAddress, workDirection };
      localStorage.setItem('userData', JSON.stringify(datos));
      close(false)
      window.location.reload()
  };

  return (
    <div className="absolute z-20 left-0 top-5 bg-white border-2 rounded-xl border-mi-color">
      <form className="p-6 flex flex-col gap-4 relative" onSubmit={guardarDatos}>
        <IconX onClick={() => close(false)} className='absolute right-2 top-2 hover:text-red-500 transition-colors cursor-pointer' />
        <h4 className="text-3xl pt-2 font-bold text-center">Change Your Basic Info</h4>
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
        <button type='submit' className="bg-blue-500 hover:bg-blue-400 transition-colors text-xl font-bold text-white rounded-2xl p-4 mt-2">Make Changes</button>
      </form>
    </div>
  )
}