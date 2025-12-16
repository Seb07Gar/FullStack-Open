import {useState } from "react"
import { useEffect } from "react";
import axios from 'axios'
import Search from "./components/Search";
import Countries from "./components/Countries";

const App = () => {

  const [searchQuery, setSearchQuery] = useState('');
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    axios.get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
        console.log('Promise Fulfilled');
      })
  }, [])
  
  const handleQueryChange = (event) => {
    setSearchQuery(event.target.value)
  }

  const handleClick = (buttonCountry) => {
    setSelectedCountry(buttonCountry)
  }
  console.log(selectedCountry);

  const countriesFiltered = searchQuery
    ? countries.filter(c => c.name.common.toLowerCase().includes(searchQuery.toLowerCase()))
    : countries
  
  //console.log(countriesFiltered);

  return (
    <div>
      <Search value={searchQuery} onChange={handleQueryChange}/>
      <Countries filteredCountries={countriesFiltered} handleClick={handleClick} selectedCountry={selectedCountry}/>
    </div>
  )
  
}


export default App