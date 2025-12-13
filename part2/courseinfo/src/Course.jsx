const Course = ({course}) => {
  return (
    <div>
      <Header courseName = {course.name}/>
      <Content parts = {course.parts}/>
    </div>
  )
}

const Content = ({parts}) => {
  const total = parts.reduce((sum, part) => sum + part.exercises, 0)
  return (
    <div>
      {parts.map(part => 
        <Part key = {part.id} part = {part}/>
      )}
      <b>total of {total} exercises</b>
    </div>
  )
}

const Part = ({part}) => {
  return (
    <p>{part.name} {part.exercises}</p>
  )
}



const Header = ({courseName}) => {
  return (
    <div>
      <h1>
        {courseName}
      </h1>
    </div>
  )
}

export default Course