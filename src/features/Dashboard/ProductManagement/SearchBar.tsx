// import { FaSearch } from 'react-icons/fa'
import '../../../styles/product_management.css'
interface SearchBarProps{
  placeholder: string
}
const SearchBar = (props:SearchBarProps) => {
  return (
    <main className=' search-container-second'>
        <input className=" search-input" type="text" name="" id="" placeholder={props.placeholder}/>
        {/* <FaSearch className="search-icon" /> */}
    </main>
  )
}

export default SearchBar