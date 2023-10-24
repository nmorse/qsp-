import { createSignal } from 'solid-js'
import './App.css'
import { createEffect } from 'solid-js';
import { createStore, Store, SetStoreFunction } from 'solid-js/store';

type ListStore = {
  [keys: string]: string[] | undefined;
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
  const [store, setStore] = createLocalStore({});
  const [listName, setListName] = createSignal(Object.keys(store)[0] ?? "default-list")
  const [count, setCount] = createSignal(0)
  const [pName, setPName] = createSignal('')
  const [availList, setAvailList] = createSignal([])
  const [complete, setComplete] = createSignal([])
  const gameOver = () => availList().length === 0 && pName().length === 0
  const textListFromStore = () => {
    const listArr = store[listName()]
    if (typeof listArr === 'object') {
      return listArr.map((n: string) => `${n}\n`).join('')
    }
    return ''
  }

  return (
    <>
      <h3>Names in a Quantum Superposition</h3>
      <div class="animation-container">
        {!gameOver() ?
          availList().map((item: any, i: number) => { return <h1 class={`name animation${i % 4 + 1}`}>{item}</h1> }) :
          null}
        <h1 id="selectedName" class={`name animation-select`}>{pName()}</h1>
      </div>

      <p style={`display:${gameOver() ? "block" : "none"}`}>Setup a list of names (one name per line), then name the list and click <strong>[new]</strong>. Next click <em>start ...</em></p>
      <div class="setupform" style={`display:${gameOver() ? "flex" : "none"}`}>
        <textarea id="srcNames" onChange={(e)=>{
          e.stopPropagation()
          e.preventDefault()
          const names = e.target.value.split(/\s*\n\s*/).filter((i: string) => i.length > 0)
          setStore(listName(), names)
        }} >
          {textListFromStore()}
        </textarea>
        <div class="vertical">
          {Object.keys(store).map((k) => <div>
            <button
              class={k === listName() ? "selected" : ""}
              value={k ? k : "un-named-list"}
              onClick={() => {
                setListName(k)
                const srcNamesEle = document.getElementById('srcNames')
                if (srcNamesEle) {
                  (srcNamesEle as HTMLInputElement).value = textListFromStore()
                }
              }}>{k ? k : "un-named-list"}</button>

            <button style="color:red" onClick={() => {
              setStore(k, undefined)
              if (k === listName()) {
                setListName(Object.keys(store)[0])
                const srcNamesEle = document.getElementById('srcNames')
                if (srcNamesEle) {
                  (srcNamesEle as HTMLInputElement).value = textListFromStore()
                }
              }
            }}
            >
              X</button> </div>)}

          <div><input id="newListName" value="" placeholder="name a new list"></input>
            <button onClick={() => {
              const newListNameEle: any = document.getElementById('newListName')
              const namesEle: any = document.getElementById('srcNames')
              if (newListNameEle && namesEle) {
                const names = namesEle?.value.split(/\s*\n\s*/).filter((i: string) => i.length > 0)
                setStore(newListNameEle.value, names)
                setListName(newListNameEle.value)
                newListNameEle.value = ''
              }
            }}
            >new</button></div></div>
        <button
          onClick={() => {
            const namesEle: any = document.getElementById('srcNames')
            if (namesEle) {
              const names = namesEle?.value.split(/\s*\n\s*/).filter((i: string) => i.length > 0)
              setAvailList(names)
              setStore(listName(), names)
              setComplete([])
              setPName('')
            }
          }
          }>&gt; start entangling particles &gt;</button>
      </div>


      <div class="card">
        <button style={`display:${!gameOver() ? "block" : "none"}`}
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
              setAvailList((o) => {
                const i = (o.findIndex((name) => name === randomName))
                return o.slice(0, i).concat(o.slice(i + 1))
              })
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
          {!availList().length ? Math.random() > 0.5 ? "jump to one of many worlds" : "check if quantum cats live forever" : count() % 3 === 0 ? 'collapse the wave function Ψ' : count() % 3 === 1 ? 'make a measurment of Ψ' : 'observe the quantum state |⟩'}
        </button>
        <div class="name-columns" >
          <div class="name-list">
            <div style="color:#999">still in superposition:</div>
            {availList().map((i: any) => { return <div>{i}</div> })}
          </div>
          <div class="name-list">
            <div style="color:#999">the one:</div>
            <div>{pName()}</div>
          </div>

          <div class="name-list">
            <div style="color:#999">collapsed in this order:</div>
            {complete().map((i: any) => { return <div>{i}</div> })}
          </div>
        </div>

      </div>
    </>
  )
}

export default App
