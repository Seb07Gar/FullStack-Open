const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  return (
    <div>
      <Header course={course} />
      <Content parts={[{name: part1, exercises: exercises1},{name: part2, exercises: exercises2},{name: part3, exercises: exercises3}]}/>
      <Excercises exercises = {[exercises1, exercises2, exercises3]}/>
    </div>
        
  )
}

const Header = (props) => {
  return (
    <div>
      <h1>{props.course}</h1>
    </div>
  )

}

const Content = (props) => {
  return(
    <div>
      <h2>Contenido</h2>
      <Part name={props.parts[0].name} exercise = {props.parts[0].exercises}/>
      <Part name={props.parts[1].name} exercise = {props.parts[1].exercises}/>
      <Part name={props.parts[2].name} exercise = {props.parts[2].exercises}/>
    </div>
  )
}

const Excercises = (props) => {
  return (
    <div>
      Number of Excercises: {props.exercises[0]+props.exercises[1]+props.exercises[2]}
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