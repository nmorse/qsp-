import { createSignal } from 'solid-js'
import './App.css'

function App() {
  const [count, setCount] = createSignal(0)
  const [pName, setPName] = createSignal('')
  const [availList, setAvailList] = createSignal([])
  const [complete, setComplete] = createSignal([])

  return (
    <>
      <h3>Names in a Quantum Super Position</h3>
      <div class="animation-container">
        {availList().length ?
          availList().map((item, i) => { return <h1 class={`name animation${i % 4 + 1}`}>{item}</h1> }) :
          null}
        <h1 id="selectedName" class={`name animation-select`}>{pName()}</h1>
      </div>

      <p style={`display:${availList().length === 0 ? "block" : "none"}`}>Setup the list of names with one name per line.</p>
      <div class="setupform" style={`display:${availList().length === 0 ? "flex" : "none"}`}>
        <textarea id="srcNames" >
          {`
Renuka
Val
Dhav
Nicko
Chris
Ruian
Curt
Nate`}
        </textarea>
        <button
          onClick={() => {
            const names = document.getElementById('srcNames').value.split(/\s*\n\s*/).filter((i) => i.length > 0)
            setAvailList(names)
            setComplete([])
            setPName('')
          }
          }>
          setup
        </button>
      </div>


      <div class="card">
        <button
          onClick={() => {
            const sn = document.getElementById('selectedName')
            let anim = ''
            if (sn) {
              anim = sn.style.animation
              sn.style.animation = 'none'
              // sn.className = 'name animation-none'
            }
            setPName("")
            const av = availList()
            if (av.length) {
              const ri = Math.floor(Math.random() * av.length)
              const randomName = av.slice(ri, ri + 1)[0]
              setPName(() => randomName)
              setAvailList((o) => o.filter((i) => i !== randomName))
              setCount((count) => count + 1)
              setComplete((o) => o.concat([randomName]))
              setTimeout(() => {
                if (sn) {
                  sn.style.animation = "1s ease-out nameAnimationSelect"
                  sn.style.animationFillMode = "forwards"
                  sn.className = 'name animation-select'
                }
              }, 50)
            }
          }}>
          { count()%3 === 0 ? 'make an measurment' :  count()%3 === 1 ?  'collapse the wave function': 'observe the quantum state'}
        </button>
        <div class="name-columns" >
        <div class="name-list">
          <div>yet to be selected:</div>
            {availList().map((i) => { return <div>{i}</div> })}
          </div>
          <div class="name-list">
            <div>the one:</div>
            <div>{pName}</div>
          </div>
          
          <div class="name-list">
            <div>selected in this orded:</div>
            {complete().map((i) => { return <div>{i}</div> })}
          </div>
        </div>

      </div>
    </>
  )
}

export default App
