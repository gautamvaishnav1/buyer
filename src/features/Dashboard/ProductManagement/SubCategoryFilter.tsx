interface Props{
  data:string[]
  subCategory:string
  setSubCategory:(value:string)=>void
}
import { Dropdown } from 'primereact/dropdown';

const SubCategoryFilter = ({data,subCategory,setSubCategory}:Props) => {
  const subCategoryOptions = [{name: 'All'}, ...data.map(cat => ({ name: cat }))]
  
  return (
    <div className="card flex justify-content-center">
      <Dropdown 
        value={subCategory} 
        onChange={(e) => setSubCategory(e.value)} 
        options={subCategoryOptions} 
        optionLabel="name"
        placeholder="Select Sub Category" 
        className="w-full md:w-14rem category-dropdown" 
      />
    </div>
  )
}

export default SubCategoryFilter