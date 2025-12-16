import Country from './Country'

const Countries = ({filteredCountries, handleClick, selectedCountry}) => {

    if(filteredCountries.length > 10)
        return(
            <div>
                Too many matches, specify another filter
            </div>
        )

    else if (filteredCountries.length > 1)
        if(selectedCountry)
            return(
                <div>
                <Country country={selectedCountry}/>
                </div>
            )
        else
            return(
                <div>
                    {filteredCountries.map(c =>
                <p key={c.cca3}>{c.name.common} <button onClick={() => handleClick(c)}>show</button></p>
                )
                }
                </div>
            )
    else if (filteredCountries.length === 0)
        return(
            <div>
                No countries found
            </div>
        )

  return (
    <div>
        <Country country={filteredCountries[0]}/>
    </div>
  )
}

export default Countries
