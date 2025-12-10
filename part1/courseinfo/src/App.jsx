const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course} />
      <Content course={course} />
      <Total course={course} />
    </div>
        
  )
}

const Header = (props) => {
  return (
    <div>
      <h1>{props.course.name}</h1>
    </div>
  )

}

const Content = (props) => {
  return(
    <div>
      <h2>Contenido</h2>
      <Part name={props.course.parts[0].name} exercise = {props.course.parts[0].exercises}/>
      <Part name={props.course.parts[1].name} exercise = {props.course.parts[1].exercises}/>
      <Part name={props.course.parts[2].name} exercise = {props.course.parts[2].exercises}/>
    </div>
  )
}

const Total = (props) => {
  return (
    <div>
      Number of Excercises: {props.course.parts[0].exercises + props.course.parts[1].exercises + props.course.parts[2].exercises}
    </div>
  )
}

const Part = (props) => {
  return(
    <div>
      <ul>
        <li>{props.name}. Exercises: {props.exercise}</li>
      </ul>
    </div>
  )
}

export default App