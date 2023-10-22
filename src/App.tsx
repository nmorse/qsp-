import { createSignal } from 'solid-js'
import './App.css'

function App() {
  const [count, setCount] = createSignal(0)
  const [pName, setPName] = createSignal('')
  const [availList, setAvailList] = createSignal([])
  const [complete, setComplete] = createSignal([])

  return (
    <>
    <h1>QSP</h1>
      <div class="animation-container">
        {availList().length ? 
          availList().map((item, i) => { return <h1 class={`name animation${i % 4 + 1}`}>{item}</h1> }) :
           null }
          <h1 id="selectedName" class={`name animation-select`}>{pName()}</h1>
      </div>
      <p>Names in a Quantum Super Position</p>
      <div style="display:flow:">
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
          setAvailList(names)
          setComplete([])
          setPName('')
        }
        }>
        set
      </button>
      </div>

      <div class="card">
        <button
          onClick={() => {
            const sn = document.getElementById('selectedName')
            let anim = ''
            if(sn) {
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
              setTimeout(()=> {
              if(sn) {
                sn.style.animation = "4s linear 0s nameAnimationSelect"
                sn.style.animationFillMode = "forwards"
                sn.className = 'name animation-select'
              }
              }, 50)
            }
          }}>
          {Math.random()>0.5? 'make an observation' : 'collapse the wave function'} {count()}
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
