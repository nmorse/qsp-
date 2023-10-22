import { createSignal } from 'solid-js'
import solidLogo from './assets/solid.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = createSignal(0)
  const [pName, setPName] = createSignal('')
  const [availList, setAvailList] = createSignal([])
  const [complete, setComplete] = createSignal([])

  return (
    <>
      <div class="animation-container">
        {availList().map((item, i) => { return <h1 class={"name animation" + (i%3 + 1)}>{item}</h1> })}
      </div>
      {/* <h1>QSP</h1> */}
      <textarea id="srcNames" >
        {`
renuka
val
dhav
      `}
      </textarea>
      <button
        onClick={() => {
          const names = document.getElementById('srcNames').value.split(/\s*\n\s*/).filter((i) => i.length > 0)
          console.log(names)
          setAvailList(names)
          setComplete([])
          setPName('')
        }
        }>
        set
      </button>

      <div class="card">
        <button
          onClick={() => {
            const av = availList()
            if (av.length) {
              const ri = Math.floor(Math.random() * av.length)
              console.log(av.slice(ri, ri + 1));
              const randomName = av.slice(ri, ri + 1)[0]
              setPName(() => randomName)
              console.log(av)
              setAvailList((o) => o.filter((i) => i !== randomName))
              setCount((count) => count + 1)
              setComplete((o) => o.concat([randomName]))
            }
          }}>
          make an observation {count()}
        </button>
        <p>{pName}</p>
        <hr />
        <div>
          {availList().map((i) => { return <div>{i}</div> })}
        </div>
        <hr />
        <div>
          {complete().map((i) => { return <div>{i}</div> })}
        </div>

      </div>
    </>
  )
}

export default App
