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

  get graphic() {
    return this.attribute("Graphic");
  }

  get accessory() {
    if (this.isMechSuit) {
      return this.mechSuit;
    } else {
      return this.attribute("Accessory");
    }
  }

  get isMechSuit() {
    return !!this.attribute("Mech Suit")
  }

  get mechSuit() {
    return this.attribute("Mech Suit").replace(/''/g, '');
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
      {!drifter &&
      <div>
        <h3>--</h3>
        <div><img className="empty" src="/img/empty-seat.png" /></div>
      </div>
      }
      {drifter &&
      <div>
        <h3>{drifter.name}</h3>
        <div><img src={imgSrc} /></div>
        <div className="attribute">
          <strong>Graphic</strong>
          //
          {drifter.graphic}
        </div>
        <div className="attribute">
          <strong>Accessory</strong>
          //
          {drifter.accessory}
        </div>
      </div>
      }
    </div>
  )
}

function App() {
  return (
    <>
      <header>
        <h1>Void Adventure</h1>
      </header>
      <h2>Crew Selection</h2>
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
