import '../../../styles/product_management.css'

interface SearchBarProps {
  placeholder: string
  value: string
  onChange: (value: string) => void
}

const SearchBar = ({ placeholder, value, onChange }: SearchBarProps) => {
  return (
    <main className="search-container-second">
      <input
        className="search-input"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
      />
    </main>
  )
}

export default SearchBar
