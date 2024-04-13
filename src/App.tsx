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
  const [newListName, setNewListName] = createSignal('')
  const [listName, setListName] = createSignal(Object.keys(store)[0] ?? "")
  const [count, setCount] = createSignal(0)
  const [pName, setPName] = createSignal('')
  const [availList, setAvailList] = createSignal([])
  const [complete, setComplete] = createSignal([])
  const gameOver = () => availList().length === 0 && pName().length === 0
  const textListFromStore = () => {
    if (listName()) {
      const listArr = store[listName()]
      if (typeof listArr === 'object') {
        return listArr.map((n: string) => `${n}\n`).join('')
      }
    }
    return ''
  }

  return (
    <>
      <h3>Quantum Spinner</h3>
      <div class="animation-container">
        {!gameOver() ?
          availList().map((item: any, i: number) => { return <h1 class={`name animation${i % 4 + 1}`}>{item}</h1> }) :
          null}
        <h1 id="selectedName" class={`name animation-select`}>{pName()}</h1>
      </div>

      <div class="setupform" style={`display:${gameOver() ? "flex" : "none"}`}>
        <div class="vertical">
          <p>Team names</p>
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
              if (window.confirm("Just checking, OK to delete?")) {
                setStore(k, undefined)
                if (k === listName()) {
                  setListName(Object.keys(store)[0] ?? "")
                  const srcNamesEle = document.getElementById('srcNames')
                  if (srcNamesEle) {
                    (srcNamesEle as HTMLInputElement).value = textListFromStore()
                  }
                }
              }
            }}
            >
              X</button> </div>)}

          <input style={{'margin-top': '20px'}} id="newListName" value="" onInput={(e) => setNewListName(e.target.value)} placeholder="new team name"></input>
          {newListName() !== "" ? <button onClick={() => {
              const newListNameEle: any = document.getElementById('newListName')
              if (newListNameEle) {
                setStore(newListNameEle.value, [])
              }
              console.log("setListName(newListNameEle.value)", newListNameEle.value)
              setListName(newListNameEle.value)
              newListNameEle.value = ''
              setNewListName('')
              const srcNameEle: any = document.getElementById('srcNames')
              srcNameEle.innerText = ''
            }}
            >create team</button> : null
          }
        </div>
        {listName() ?
          <div class="vertical">
            <p>Team members<br />(one name per line)</p>
            <textarea id="srcNames" onChange={(e) => {
              e.stopPropagation()
              e.preventDefault()
              const names = e.target.value.split(/\s*\n\s*/).filter((i: string) => i.length > 0)
              setStore(listName(), names)
            }} >
              {textListFromStore()}
            </textarea>
          </div> : null
        }
        {listName() ?
          <div class="vertical">
            <p>click <em>spin</em> to begin</p>
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
              }>&gt; spin &gt;</button>
          </div> : null}
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
          {!availList().length ? Math.random() > 0.5 ? "spin down and go back to the ground state" : "back to classical physics" : count() % 3 === 0 ? 'pluck a name out of the quantum soup' : count() % 3 === 1 ? 'collapse the wave function Ψ to get the next name' : 'observe the next name in the quantum state |⟩'}
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
