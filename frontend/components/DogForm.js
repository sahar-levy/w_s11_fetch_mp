import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const initialForm = { name: '', breed: '', adopted: false }

// Use this form for both POST and PUT requests!
export default function DogForm({ dog, reset, getDogs }) {
  const navigate = useNavigate()
  const [values, setValues] = useState(initialForm)
  const [breeds, setBreeds] = useState([])

  useEffect(() =>{
    fetch('/api/dogs/breeds')
      .then(res => res.json())
      .then(breeds => setBreeds(breeds.toSorted())) //toSorted returns a new array, does not mutate original
      .catch(err => console.error(err))
  }, [])

  // effect that fires on change of dog
  useEffect(() => {
    if (dog) setValues(dog) //this makes it so that when 'edit' mode, dog's details populate in form to be edited
    else setValues(initialForm) //this resets form once edit mode is exited
  }, [dog])

  const postDog = () => {
    fetch('/api/dogs', {
      method: 'POST',
      body: JSON.stringify(values),
      headers: new Headers({'Content-Type': 'application/json'})
    })
      .then(res => {
        if (!res.ok) throw new Error('Problem POSTing dog')
        getDogs()
        navigate('/') //this also takes care of clearing values in the form bc the whole form will become unmounted
      })
      .catch(err => console.error(err))
  }
  const putDog = () => {
    fetch(`/api/dogs/${values.id}`, { //the id of the dog is curently being held inside the state of the form, dog is set inside the state of the form.
      method: 'PUT',
      body: JSON.stringify(values),
      headers: new Headers({'Content-Type': 'application/json'})
    })
      .then(res => {
        if (!res.ok) throw new Error('Problem PUTing dog')
        getDogs()
        reset()
        navigate('/') //this also takes care of clearing values in the form bc the whole form will become unmounted
      })
      .catch(err => console.error(err))
  }
  const onReset = (e) => {
    e.preventDefault()
    setValues(initialForm)
    reset()
  }
  
  const onSubmit = (event) => {
    event.preventDefault()
    const action = dog ? putDog : postDog
    action()
  }
  const onChange = (event) => {
    const { name, value, type, checked } = event.target
    setValues({
      ...values, [name]: type === 'checkbox' ? checked : value
    })
  }
  return (
    <div>
      <h2>
      {dog ? 'Update Dog' : 'Create Dog'} 
      </h2>
      <form onSubmit={onSubmit}>
        <input
          name="name"
          value={values.name}
          onChange={onChange}
          placeholder="Name"
          aria-label="Dog's name"
        />
        <select
          name="breed"
          value={values.breed}
          onChange={onChange}
          aria-label="Dog's breed"
        >
          <option value="">---Select Breed---</option>
          {/* Populate this dropdown using data obtained from the API */}
          {breeds.map(breed => <option key={breed}>{breed}</option>)}
        </select>
        <label>
          Adopted: <input
            type="checkbox"
            name="adopted"
            checked={values.adopted}
            onChange={onChange}
            aria-label="Is the dog adopted?"
          />
        </label>
        <div>
          <button type="submit">
            {dog ? 'Update Dog' : 'Create Dog'} 
          </button>
          <button onClick={onReset} aria-label="Reset form">Reset</button>
        </div>
      </form>
    </div>
  )
}
