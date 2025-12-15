const Persons = ({ persons, filter, onDelete }) => {
  const personsFiltered = filter
    ? persons.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()))
    : persons

  return (
    <div>
      {personsFiltered.map(p =>
        <p key={p.id}>{p.name} {p.number}
        <button onClick={() => onDelete(p.id, p.name)}>delete</button></p>
      )}
    </div>
  )
}
export default Persons
