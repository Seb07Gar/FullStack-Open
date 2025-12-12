import { useState } from 'react'

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)


  const addGood= () => setGood(good + 1) 
  const addNeutral= () => setNeutral(neutral + 1) 
  const addBad= () => setBad(bad + 1)
  
  return (
    <div>
      <Header/>
      <Button onClick = {addGood} option = "good"/>
      <Button onClick = {addNeutral} option = "neutral"/> 
      <Button onClick = {addBad} option = "bad"/>
      <Statistics good = {good} neutral = {neutral} bad = {bad}/>
      
    </div>
  
  )
}

const Header = () => {
  return(
    <div>
      <h1>give feedback</h1>
    </div>
  )
}

const Button = (props) => {
  
  return(
    <button onClick={props.onClick}>{props.option}</button>
  )
}

const Statistics = (props) => {
  const good = props.good
  const neutral = props.neutral
  const bad = props.bad
  const total = good + bad + neutral
  const average = ((good-bad)/total)
  const positive = good/total

  
  if (total != 0){
    return(
      <div>
        <h1>statistics</h1>
        <table>
          <tbody>
          <StatisticLine text = "good" value = {good}/>
          <StatisticLine text = "neutral" value = {neutral}/>
          <StatisticLine text = "bad" value = {bad}/>
          <StatisticLine text = "all" value = {total}/>
          <StatisticLine text = "average" value = {average}/>
          <StatisticLine text = "positive" value = {positive*100 + " %"}/>
          </tbody>
        </table>
        
      </div>
  )
  } else {
    return (
      <div>
        <h1>statistics</h1>
        <p>No feedback given</p>
      </div>
    ) 
  }

}

const StatisticLine = ({text, value}) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )

}

export default App