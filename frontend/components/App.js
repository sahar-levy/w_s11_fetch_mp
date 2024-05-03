import React, {useState, useEffect} from 'react'
import { Routes, Route, NavLink } from 'react-router-dom'
import DogForm from './DogForm'
import DogsList from './DogsList'

export default function App() {
  const [dogs, setDogs] = useState([])
  const [currentDogId, setCurrentDog] = useState(null) //when being edited, null will be an id of the dog being edited

  // effect that calls getDogs()
  useEffect(() => {
    getDogs()
  }, [])

  // fxn to fetch dogfs from API '/api/dogs'
  const getDogs = () => {
    fetch('/api/dogs')
      .then(res => {
        if (!res.ok) throw new Error('Problem GETing dogs')
        return res.json()
      })
      .then(setDogs)
      .catch(err => console.error(err))
  }

  return (
    <div>
      <nav>
        <NavLink to="/">Dogs</NavLink>
        <NavLink to="/form">Form</NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<DogsList
          dogs={dogs}
          getDogs={getDogs}
          setCurrentDog={setCurrentDog}
        />} />
        <Route path="/form" element={<DogForm 
          dog={currentDogId && dogs.find(d => d.id == currentDogId)} 
          //this is how the form knows if it's in creation mode or edit mode
          // if currentDogId is null then we are in creation mode
          // if theres a dog prop which is an obj then we are editing and we will use the data in that obj to populate the fields of the form

          getDogs={getDogs}
          reset={() => setCurrentDog(null)}
        />} />
      </Routes>
    </div>
  )
}
