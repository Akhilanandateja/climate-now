import React from 'react'
import Weather from './components/Weather'

export default function App(){
  return (
    <div className="app">
      <header><h1>Weather App</h1></header>
      <main>
        <Weather />
      </main>
    </div>
  )
}
