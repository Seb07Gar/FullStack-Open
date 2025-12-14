const Persons = ({ persons, filter }) => {
  const personsFiltered = filter
    ? persons.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()))
    : persons

  return (
    <div>
      {personsFiltered.map(p =>
        <p key={p.id}>{p.name} {p.number}</p>
      )}
    </div>
  )
}
export default Persons
