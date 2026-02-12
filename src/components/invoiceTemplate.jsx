import { useState,useRef } from 'preact/hooks';
import html2canvas from 'html2canvas';
import FormDataModal from './FormDataModal';
import { IconTrash, IconEdit, IconEditOff, IconCamera } from '@tabler/icons-preact';


export default function InvoiceTemplate({clientName,clientAddress, userName,companyName,workDirection,emailAddress,phoneNumber}){
  const facturaRef = useRef(null);
  const [showFormModal,setShowFormModal] = useState(false)
  const [editMode,setEditMode] = useState(true)
  const [clientData,setClientData] = useState([
  { amount: "-", description: "-", date: "-", cost: "-", total: "-" }
])

  const date = new Date()
  const formatDate = (date) => {
    if(date === '-' ) return "-"
    const newDate = new Date(`${date}T00:00:00`)
    return newDate.toLocaleDateString('en-US')
  }

  const descargarFactura = async () => {
      // Esperar a que las fuentes se carguen (importante si usas Google Fonts)
      await document.fonts.ready;

      // Capturar el elemento con html2canvas
      const canvas = await html2canvas(facturaRef.current, {
        scale: 2, // Mejor calidad
        logging: true, // Para depuración
        useCORS: true, // Permitir imágenes externas
        allowTaint: true, // Permitir imágenes de otros dominios
      });

      // Crear un enlace para descargar la imagen
      const link = document.createElement('a');
      link.download = 'Invoice.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
  };

  const handelClick = (data) => {
    setShowFormModal(data)
  }

  const takeClientData = (data) => {
    let copy = [...clientData]

    if(copy[0].amount === "-"){
      
      copy = [...data]
      setClientData(copy)

    } else {
      copy = [...clientData, ...data]
      setClientData(copy)
    }
  }

    const deleteRow = (index) => {
    if(clientData.length !== 1){
      const newRows = [...clientData];
      newRows.splice(index, 1);
      setClientData(newRows);
    } else {
      setClientData([{ amount: "-", description: "-", date: "-", cost: "-", total: "-" }])
    }  
  }

  const camb = () => {
    setEditMode(!editMode)
  }


  return(
    <div className='absolute bg-white border-2 rounded-xl border-mi-color top-10 my-20'>
      <button 
      className={`absolute cursor-pointer left-10 top-5 rounded-xl z-10 bg-blue-500 ${editMode && "bg-red-400"} p-2`} 
      onClick={camb}>
        {!editMode ? <IconEdit /> : <IconEditOff />} 
      </button>

      {!editMode && 
      <button
      className='absolute cursor-pointer left-22 top-5 rounded-xl z-10 bg-blue-500 p-2' 
      onClick={descargarFactura}
      >
        {<IconCamera />}
      </button> }
      
      <section ref={facturaRef} className="w-full p-10   ">

        <header>
          <div className="flex justify-between items-end relative">
            <p className=''>Invoice No.</p>
            <h2 className="text-8xl font-bold">Invoice</h2>
          </div>
          <hr className="mt-8" />
        </header>

        <div className='flex justify-between mt-10 '>
          <div>
            <p className='font-semibold text-2xl'>BILL TO:</p>
            <p className='text-xl'>{clientName}</p>
          </div>
          <div className='flex items-center gap-10 mr-20'>
            <p className='font-semibold text-2xl'>DATE:</p>
            <p className='text-xl'>{date.toLocaleDateString('en-US')}</p>
          </div>
        </div>
        
        <div className='mt-10'>
          <div className='grid text-start grid-cols-10'>
            <h5 className='text-2xl font-bold'>DESCRIPTION</h5>
            <h5 className='col-start-4 text-2xl font-bold'>DATE</h5>
            <h5 className='col-start-7 text-2xl font-bold'>PRICE</h5>
            <h5 className='col-start-10 text-2xl font-bold'>SUBTOTAL</h5>
          </div>
          {clientData.map((data,index) => {
            return(
              <div className='grid text-start grid-rows-2 grid-cols-10' key={index}>
                <p className='row-start-2 text-xl col-span-2'>{data.description}</p>
                <p className='row-start-2 text-xl col-start-4'>{formatDate(data.date)}</p>
                <p className='row-start-2 text-xl col-start-7'>$ {data.cost}{data.amount > 1 && `/ ${data.amount}`}</p>
                <p className='row-start-2 text-xl col-start-10 relative'>$ {data.total} 
                  {editMode &&
                    <IconTrash 
                    className={"absolute right-0 top-0 hover:text-red-500 transition-colors cursor-pointer"} 
                    onClick={() => deleteRow(index)}/>
                  }
                </p>
              </div>
            )
          })}
          {editMode && 
            <div onClick={() => handelClick(true)} className='flex justify-center items-center w-full h-20 mt-5  text-blue-400 text-center border border-dashed rounded-3xl bg-blue-100 cursor-pointer hover:bg-blue-300 hover:text-blue-500'>
              <p className='text-3xl font-semibold'>Click Here to Add Rows</p>
            </div>
          }
          {showFormModal && <FormDataModal sendClientData={takeClientData} close={(x) => handelClick(x)}/>}

          <hr className='my-4' />
          <div className='flex justify-end items-center gap-2 mr-20'>
            <h4 className='font-bold text-3xl'>TOTAL: </h4>
            <p className='text-3xl font-semibold'>{clientData.length === 1  ? clientData[0].total : 
            clientData.reduce((accumlador,siguiente) => {return accumlador + siguiente.total}, 0)}</p>
          </div>
        </div>

        <div>
          <div className='flex justify-between mt-8 mx-4 text-xl'>
            <p>Address of the working place:</p>
            <p>{clientAddress}</p>
          </div>
          <div className='flex justify-between mt-8 mx-4 font-bold'>
            <div>
              <p>Payment Information</p>
              <p>{companyName}</p>
            </div>
            <div className='flex flex-col'>
              <p>{userName}</p>
              <p>{workDirection}</p>
              <p>{phoneNumber}</p>
              <p>{emailAddress}</p>
            </div>
          </div>
        </div>

      </section>
    </div>
  )
}