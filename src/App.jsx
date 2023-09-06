import { useEffect, useState } from 'react'
import { useStore } from './store';
import './App.css'

class Drifter {
  constructor(metadata) {
    this.metadata = metadata;
  }

  get name() {
    return this.metadata.name;
  }

  get attributes() {
    return this.metadata.attributes;
  }

  attribute(type) {
    return this.attributes.filter(({ trait_type }) => (trait_type == type))?.[0]?.value;
  }
}

function DrifterLookup({ slotIndex }) {
  const [ state, dispatch ] = useStore();
  const [ drifterId, setDrifterId ] = useState(null);
  const onSubmit = async (e) => {
    e.preventDefault();
    const id = e.target.children.drifterId.value;
    if (id) {
      setDrifterId(id);
    }
  }
  useEffect(() => {
    if (drifterId) {
      fetch(`/drifters/${drifterId}.json`)
        .then(r => r.json())
        .then(md => dispatch('SET_DRIFTER_SLOT', {
          slotIndex,
          drifter: new Drifter(md),
        }))
    }
  }, [drifterId]);
  const drifter = state.drifterSlots[slotIndex];
  const imgSrc = `/images/${drifterId}.jpg`;
  return (
    <div className="DrifterLookup">
      <form onSubmit={onSubmit}>
        <input type="text" name="drifterId" placeholder="Drifter ID" />
      </form>
      {drifter &&
      <div>
        <h3>{drifter.name}</h3>
        <div><img src={imgSrc} /></div>
        <ul>
          {["Graphic", "Accessory"].map(trait_type => {
            return (
              <li key={trait_type}>
                <strong>{trait_type}</strong>
                {drifter.attribute(trait_type)}
              </li>
            );
          })}
        </ul>
      </div>
      }
    </div>
  )
}

function App() {
  return (
    <>
      <div className="row">
        <DrifterLookup slotIndex={0} />
        <DrifterLookup slotIndex={1} />
        <DrifterLookup slotIndex={2} />
        <DrifterLookup slotIndex={3} />
        <DrifterLookup slotIndex={4} />
      </div>
      <hr />
    </>
  )
}

export default App
