interface Props{
  data:string[]
  category:string
  setCategory:(value:string)=>void
}
import { Dropdown } from 'primereact/dropdown';
const CategoryFilter = ({data,setCategory,category}:Props) => {
    const categoryOptions = [{name: 'All'}, ...data.map(cat => ({ name: cat }))]

console.log(data,setCategory,'###############################################sagjkghjkfjkdsjkdshgjkhdjskhkjkfdjshjkh')
 return (
        <div className="card flex justify-content-center">
            <Dropdown value={category} onChange={(e) =>setCategory(e.value)} options={categoryOptions} optionLabel="name" 
                placeholder="Select Category" className="w-full md:w-14rem category-dropdown" />
        </div>
  )
}

export default CategoryFilter