import { useState } from "preact/hooks"
import UserChangeModal from "./UserChangeModal"

export default function BubbleUser ({userName, oldUserData}){
  const [openModal,setOpenModal] = useState(false)
  
  const handleModal = (value) => {    
    setOpenModal(value)
  }

  const fristLetters = userName.split('', 2).join('').toUpperCase()
  return(
    <>
      <div className="absolute top-5 left-0" onClick={() => handleModal(true)}>
        <h2 className="size-16 bg-blue-500 rounded-xl text-2xl font-bold flex items-center justify-center cursor-pointer">
          {fristLetters}
        </h2>
      </div>
      {!openModal ? '' : <UserChangeModal close={(x) => handleModal(x)} oldUserData={oldUserData} />}
    </>
  )
}