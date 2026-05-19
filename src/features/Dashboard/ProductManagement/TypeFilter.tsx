import { useState } from 'react';
import { Dropdown } from 'primereact/dropdown';

const TypeFilter = () => {
  const typeOptions = [
    { name: 'All' },
    { name: 'Wholesale' },
    { name: 'Retail' }
  ];
  
  const [type, setType] = useState('All');
  
  return (
    <div className="card flex justify-content-center">
      <Dropdown 
        value={type} 
        onChange={(e) => setType(e.value)} 
        options={typeOptions} 
        optionLabel="name"
        placeholder="Select Type" 
        className="w-full md:w-14rem category-dropdown" 
      />
    </div>
  )
}

export default TypeFilter