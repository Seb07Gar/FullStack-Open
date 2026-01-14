import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { getAnecdotes, createAnecdote, updateAnecdote } from './requests'
import { useContext } from 'react'
import NotificationContext from './context/NotificationContext'

const App = () => {
  const queryClient = useQueryClient()

  const { notificationDispatch } = useContext(NotificationContext)

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })

      notificationDispatch({
        type: 'SET_NOTIFICATION',
        payload: `anecdote '${newAnecdote.content}' created`
      })

      setTimeout(() => {
        notificationDispatch({ type: 'CLEAR_NOTIFICATION' })
      }, 5000)
    },

    onError: (error) => {
      notificationDispatch({
        type: 'SET_NOTIFICATION',
        payload: 'anecdote must be at least 5 characters long'
      })

      setTimeout(() => {
        notificationDispatch({type: 'CLEAR_NOTIFICATION'})
      }, 5000)
    }
  })

  
  const voteAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (updateAnecdote) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })

      notificationDispatch({
        type: 'SET_NOTIFICATION',
        payload: `you voted '${updateAnecdote.content}'`
      })

      setTimeout(() => {
        notificationDispatch({type: 'CLEAR_NOTIFICATION'})
      }, 5000);
    },
  })

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: false,
  })

  if (result.isLoading) {
    return <div>loading...</div>
  }

  if (result.isError) {
    return (
      <div>
        anecdote service not available due to problems in server
      </div>
    )
  }

  const anecdotes = result.data

  const handleVote = (anecdote) => {
    voteAnecdoteMutation.mutate({
      ...anecdote,
      votes: anecdote.votes + 1,
    })
  }

  
  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />

      <AnecdoteForm createAnecdote={(content) => newAnecdoteMutation.mutate({ content, votes: 0 })}/>

      {anecdotes.map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
