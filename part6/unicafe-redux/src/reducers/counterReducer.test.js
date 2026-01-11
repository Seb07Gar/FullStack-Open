import deepFreeze from 'deep-freeze'
import { describe, expect, test } from 'vitest'
import counterReducer from './counterReducer'

describe('unicafe reducer', () => {
  const initialState = {
    good: 0,
    ok: 0,
    bad: 0
  }

  test('should return a proper initial state when called with undefined state', () => {
    const action = {
      type: 'DO_NOTHING'
    }

    const newState = counterReducer(undefined, action)
    expect(newState).toEqual(initialState)
  })

  test('good is incremented', () => {
    const action = {
      type: 'GOOD'
    }
    const state = initialState

    deepFreeze(state)
    const newState = counterReducer(state, action)
    expect(newState).toEqual({
      good: 1,
      ok: 0,
      bad: 0
    })
  })

  test('ok is incremented', () => {
    const action = {
      type: 'OK'
    }
    const state = initialState

    deepFreeze(state)
    const newState = counterReducer(state, action)

    expect(newState).toEqual({
      good: 0,
      ok: 1,
      bad: 0
    })
  })

  test('bad is incremented', () => {
    const action = {
      type: 'BAD'
    }
    const state = initialState

    deepFreeze(state)
    const newState = counterReducer(state, action)

    expect(newState).toEqual({
      good: 0,
      ok: 0,
      bad: 1
    })
  })

  test('reset sets state back to initial', () => {
    const action = {
      type: 'RESET'
    }

    const state = {
      good: 5,
      ok: 4,
      bad: 3
    }

    deepFreeze(state)
    const newState = counterReducer(state, action)

    expect(newState).toEqual({
      good: 0,
      ok: 0,
      bad: 0
    })
  })

  test('multiple actions work correctly', () => {
    const actions = [
      { type: 'GOOD' },
      { type: 'GOOD' },
      { type: 'OK' },
      { type: 'BAD' },
      { type: 'RESET' }
    ]

    let state = initialState
    actions.forEach(action => {
      state = counterReducer(state, action)
    })

    expect(state).toEqual({
      good: 0,
      ok: 0,
      bad: 0
    })
  })

})
