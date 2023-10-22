import { createSignal } from 'solid-js'
import './App.css'
import { createEffect } from 'solid-js';
import { createStore, Store, SetStoreFunction } from 'solid-js/store';

type ListStore = { 
  list: string[];
};

function createLocalStore(initState: ListStore): [Store<ListStore>, SetStoreFunction<ListStore>] {
  const [state, setState] = createStore(initState);
  if (localStorage.mystore) {
    try {
      setState(JSON.parse(localStorage.mystore));
    } catch (error) {
      setState(() => initState);
    }
  }
  createEffect(() => {
    localStorage.mystore = JSON.stringify(state);
  });
  return [state, setState];
}


function App() {
  const [store, setStore] = createLocalStore({ list: [] });
  const [count, setCount] = createSignal(0)
  const [pName, setPName] = createSignal('')
  const [availList, setAvailList] = createSignal([])
  const [complete, setComplete] = createSignal([])

  return (
    <>
      <h3>Names in a Quantum Superposition</h3>
      <div class="animation-container">
        {availList().length ?
          availList().map((item, i) => { return <h1 class={`name animation${i % 4 + 1}`}>{item}</h1> }) :
          null}
        <h1 id="selectedName" class={`name animation-select`}>{pName()}</h1>
      </div>

      <p style={`display:${availList().length === 0 ? "block" : "none"}`}>Setup the list of names (one name per line).</p>
      <div class="setupform" style={`display:${availList().length === 0 ? "flex" : "none"}`}>
        <textarea id="srcNames" >
          {store?.list.map((n:string) => `${n}\n`)}
        </textarea>
        <button
          onClick={() => {
            const namesEle: any = document.getElementById('srcNames') as any
            if (namesEle) {
              const names = namesEle?.value.split(/\s*\n\s*/).filter((i: string) => i.length > 0)
              setAvailList(names)
              setStore('list', names)
              setComplete([])
              setPName('')
            }
          }
          }>
          setup
        </button>
      </div>


      <div class="card">
        <button style={`display:${availList().length !== 0 ? "block" : "none"}`}
          onClick={() => {
            const sn = document.getElementById('selectedName')
            if (sn) {
              sn.style.animation = 'none'
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
          {count() % 3 === 0 ? 'collapse the wave function Ψ' : count() % 3 === 1 ? 'make an measurment of Ψ' : 'observe the quantum state |⟩'}
        </button>
        <div class="name-columns" >
          <div class="name-list">
            <div style="color:#999">still in superposition:</div>
            {availList().map((i) => { return <div>{i}</div> })}
          </div>
          <div class="name-list">
            <div style="color:#999">the one:</div>
            <div>{pName()}</div>
          </div>

          <div class="name-list">
            <div style="color:#999">collapsed in this orded:</div>
            {complete().map((i) => { return <div>{i}</div> })}
          </div>
        </div>

      </div>
    </>
  )
}

export default App
