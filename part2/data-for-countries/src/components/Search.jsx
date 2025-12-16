const Search = ({value, onChange}) => {
  return (
    <div>
      find countries <input value={value} onChange={onChange}></input>
    </div>
  )
}

export default Search
