import { useState , useEffect} from 'preact/hooks'
import  InitForm  from './components/initForm.jsx'
import BubbleUser from './components/bubbleUser.jsx';
import InvoiceTemplate from './components/invoiceTemplate.jsx';
import InitClientModal from './components/initClientModal.jsx';
import { IconFile, IconUser } from '@tabler/icons-preact';



export function App() {
const [isNew, setIsNew] = useState(true)
const [formInit, setFormInit] = useState(false)
const [clientInit, setClientInit] = useState(false)
const [basicOfClient, setBasicOfClient] = useState(false)
const [userData, setUserData] = useState(null)

// Cargar datos al montar el componente
useEffect(() => {
  const datosGuardados = localStorage.getItem('userData');
  console.log("Siempre es nuevo cada vez que se actualiza la pagina",isNew);
  
  if (!datosGuardados) {    
    setIsNew(true);
    return
  }

  const datosParsed = JSON.parse(datosGuardados);
  setUserData(datosParsed);   

  setIsNew(false);
}, [formInit]);

  // MANEJAR LOS DATOS DE INICIO 
  const saveUserData = () => {
    setFormInit(true)
  }

  // CERRAR MODULOS
  const closeModule = (value) => {
    setFormInit(value)
    setClientInit(value)
  }

  // MANEJAR EL NOMBRE DEL CLIENTE 
  const handlebasicOfClient = (name, address) =>{
    setBasicOfClient([name, address])
    console.log("esta es la basci INFO DEL CLIENTE:", basicOfClient);
    
  }
  
  // FUNCION PRINCIPAL DE CREAR EL INVOICE
  const createInvoice = () => {
    if(isNew){
      return saveUserData()
    }
    if(!basicOfClient){
      setClientInit(true)
    }

  }

  return (
    <main className='flex max-w-7xl min-w-xs w-full min-h-dvh justify-center items-center mx-auto relative'>
      {!basicOfClient && 
      <button 
        className='absolute flex items-center gap-2 top-10 rounded-lg p-2 bg-blue-400 text-2xl font-bold cursor-pointer hover:bg-blue-500 transition-all' 
        onClick={createInvoice}> 
        {isNew ? "Enter Basic Data" : `Create Invoice` }
        {isNew ? <IconUser /> : <IconFile /> }

      </button>}
      
      {formInit && isNew && <InitForm close={(x) => closeModule(x)} /> }
      {!isNew && <BubbleUser userName={userData.userName} oldUserData={userData} />}
      {clientInit && <InitClientModal close={(x) => closeModule(x)} sendClientName={handlebasicOfClient} />}
      {!basicOfClient ? '' : <InvoiceTemplate 
      clientName={basicOfClient[0]} 
      clientAddress={basicOfClient[1]}
      userName={userData.userName}
      companyName={userData.companyName}
      workDirection={userData.workDirection}
      phoneNumber={userData.phoneNumber}
      emailAddress={userData.emailAddress}
      />}
    </main>
  )
}
