import { useState } from 'preact/hooks';
import {IconCurrencyDollar, IconTrash } from '@tabler/icons-preact';

export default function InputsOfDataModal({onSendData}){

  const [inputRows, setInputRows] = useState([
  { amount: 1, description: "", date: "", cost: "", total: 0 }
]);

  const handleInputChange = (index, field, value) => {
    const newRows = [...inputRows];
    newRows[index][field] = value;

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
    onSendData(inputRows)
  }

  return(
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

            <IconTrash className={"mt-1.5 hover:text-red-500 transition-colors"} onClick={() => deleteInput(index)} />
            <hr className='absolute w-full -bottom-3 text-gray-300' /> 
          </div>
        )
      })}
      <div onClick={handleClick} className='flex justify-center items-center w-full h-15 mt-5 mb-15 text-5xl text-blue-400 text-center border border-dashed rounded-3xl bg-blue-100 hover:bg-blue-300 hover:text-blue-600 cursor-pointer hover:shadow-xl shadow-blue-200 transition-all '>+</div>
      <button onClick={sendData} className='absolute bottom-8 right-10'>OK</button>
    </div>
  )
}