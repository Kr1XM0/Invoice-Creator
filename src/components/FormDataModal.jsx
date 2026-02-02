import { useState } from 'preact/hooks';
import { IconX, IconCurrencyDollar, IconTrash, IconCheck } from '@tabler/icons-preact';

export default function FormDataModal ({close, sendClientData}){

    const [inputRows, setInputRows] = useState([
  { amount: 1, description: "", date: "", cost: "", total: 0 }
]);

  const handleInputChange = (index, field, value) => {
    const newRows = [...inputRows];
    if(field !== "description" && field !== "date"){
      newRows[index][field] = value.replace(/[^0-9.]/g, "").replace(/(\..*?)\..*/g, "$1");
    } 
    else {
      newRows[index][field] = value;
    }

    if (field === "amount" || field === "cost") {
      const amount = parseFloat(newRows[index].amount) || 0;
      const cost = parseFloat(newRows[index].cost) || 0;
      newRows[index].total = amount * cost;
    }

    setInputRows(newRows);
  };
  
  const handleClick = () => {
    setInputRows([...inputRows, { amount: 1, description: "", date: "", cost: "", total: 0 }]);
  }
  
  const deleteInput = (index) => {
    if(inputRows.length !== 1){
      const newRows = [...inputRows];
      newRows.splice(index, 1);
      setInputRows(newRows);
    } else {
      setInputRows([{ amount: 1, description: "", date: "", cost: "", total: 0 }])
    }  
  }

  const sendData = (e) => {
    e.preventDefault()
    sendClientData(inputRows)
    close(false)
  }

  return(
    <div className="absolute left-0 right-0 m-auto top-28 w-3/4 min-h-4/5 shadow-xl bg-white border-2 border-gray-300 rounded-xl">
      <IconX onClick={() => close(false)} className='cursor-pointer absolute right-5 top-2.5 hover:text-red-500 transition-colors' />
      <h2 className="text-center text-3xl font-bold mt-5">Enter your client's Data</h2>
        <form onSubmit={sendData}  className="p-6 flex flex-col gap-4">
          <div className='flex gap-2.5 text-center'>
            <label className='text-xl font-bold' htmlFor="">CANT</label>
            <label className='text-xl font-bold pl-10' htmlFor="">DATE</label>
            <label className='text-xl font-bold pl-48' htmlFor="">DESCRIPTION</label>
            <label className='text-xl font-bold pl-36' htmlFor="">PRICE</label>
            <label className='text-xl font-bold pl-12' htmlFor="">SUBTOTAL</label>
          </div>
          <div className='flex flex-col items-center gap-7'>
            {inputRows.map((row,index) => {
              return(
                <div key={index} className='flex relative gap-2.5'>
                  <input 
                  className="border rounded-lg h-10 w-14 px-2" 
                  type="number"
                  min="1"
                  value={row.amount}
                  onChange={(e) => handleInputChange(index, "amount", e.target.value)}
                  />
                  
                  <input
                  required 
                  className="border rounded-lg h-10 w-36 px-2" 
                  type="date"
                  onChange={(e) => handleInputChange(index, "date", e.target.value)}
                  value={row.date}
                  
                  />

                  <input
                  required 
                  className="border rounded-lg h-10 w-96 px-2" 
                  type="text"
                  onChange={(e) => handleInputChange(index, "description", e.target.value)}
                  value={row.description}

                  />
                  
                  <div className='relative'>
                    <input
                    required 
                    className="border  text-end rounded-lg h-10 w-32 px-2" 
                    type="text"
                    onChange={(e) => handleInputChange(index, "cost", e.target.value)}
                    value={row.cost}
                    />
                    <IconCurrencyDollar className={'absolute text-gray-700  left-1 top-2 '} />
                  </div>

                  <div className='relative'>
                    <input
                    required 
                    className="border text-end rounded-lg h-10 w-32 px-2" 
                    type="text"
                    readonly
                    value={row.total}
                    />
                    <IconCurrencyDollar className={'absolute text-gray-700 left-1 top-2 '} />
                  </div>

                  <IconTrash className={"mt-1.5 hover:text-red-500 transition-colors cursor-pointer"} onClick={() => deleteInput(index)} />
                  <hr className='absolute w-full -bottom-3 text-gray-300' /> 
                </div>
              )
            })}
            <div onClick={handleClick} className='flex justify-center items-center w-full h-15 mt-5 mb-20 text-5xl text-blue-400 text-center border border-dashed rounded-3xl bg-blue-100 hover:bg-blue-300 hover:text-blue-600 cursor-pointer hover:shadow-xl shadow-blue-200 transition-all '>+</div>
            <button className='cursor-pointer absolute bottom-3 right-3 bg-blue-400 p-4 rounded-full hover:bg-blue-500 transition-colors'><IconCheck /></button>
          </div>
        </form>
      </div>

  )
}