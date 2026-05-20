import { FaSearch } from 'react-icons/fa'
import '../../../styles/product_management.css'
const SearchBar = () => {
  return (
    <main className=' search-container-second'>
        <input className=" search-input" type="text" name="" id="" placeholder="Enter product "/>
        <FaSearch className="search-icon" />
    </main>
  )
}

export default SearchBar