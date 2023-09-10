import { useEffect, useState } from 'react'
import { useStore } from './store';
import { State } from './adventure_store';
import { MAX_SCENARIO, startScenario } from './scenarios';
import './App.css'

class Drifter {
  constructor(id, metadata) {
    this.id = id;
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

  get headgear() {
    return this.attribute("Headgear");
  }

  get isMechSuit() {
    return !!this.attribute("Mech Suit")
  }

  get mechSuit() {
    return this.attribute("Mech Suit").replace(/''/g, '');
  }

  totalScore(scenarios) {
    return scenarios.reduce((a, s) => (a + s.drifterTotalBuff(this)), 0);
  }
}

function DrifterLookup({ slotIndex }) {
  const [ stateMap, dispatch ] = useStore();
  const state = new State(stateMap);
  const [ drifterId, setDrifterId ] = useState(null);
  const onSubmit = (e) => {
    e.preventDefault();
    const id = e.target.children.drifterId.value;
    if (id) {
      setDrifterId(id);
    }
  }
  const onBlur = (e) => {
    const id = e.target.value;
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
          drifter: new Drifter(drifterId, md),
        }))
    }
  }, [drifterId]);
  const emptyImgSrc = `/img/empty-seat-${slotIndex}.png`;
  const drifter = state.getDrifter(slotIndex);
  const imgSrc = `/images/${drifterId}.jpg`;
  return (
    <div className="DrifterLookup">
      {!state.isMissionStarted &&
        <form onSubmit={onSubmit}>
          <input type="text" tabIndex={slotIndex+1} name="drifterId" placeholder="Drifter ID" onBlur={onBlur} />
        </form>
      }
      {!drifter &&
      <div>
        <h3>--</h3>
        <div><img className="empty" src={emptyImgSrc} /></div>
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
          <strong>Headgear</strong>
          //
          {drifter.headgear}
        </div>
        <div className="attribute">
          <strong>Accessory</strong>
          //
          {drifter.accessory}
        </div>
        {state.isMissionStarted &&
        <div className="attribute">
          <strong>Score</strong>
          //
          {drifter.totalScore(state.scenarios)}
        </div>
        }
      </div>
      }
    </div>
  )
}

function CrewSelector() {
  const [ stateMap, dispatch ] = useStore();
  const state = new State(stateMap);
  return (
    <div>
      {!state.isMissionStarted && <h2>Crew Selection</h2>}
      <div className="row">
        <DrifterLookup slotIndex={0} />
        <DrifterLookup slotIndex={1} />
        <DrifterLookup slotIndex={2} />
        <DrifterLookup slotIndex={3} />
        <DrifterLookup slotIndex={4} />
      </div>
    </div>
  );
}

function roll() {
  return Math.floor(Math.random() * 20) + 1;
}

function StartMission() {
  const [ stateMap, dispatch ] = useStore();
  const state = new State(stateMap);
  const onClick = (e) => {
    e.preventDefault();
    dispatch('ADD_SCENARIO', { scenario: startScenario(0, roll()) });
  }
  if (!state.isMissionStarted) {
    return (
      <div className="StartMission">
        <button disabled={!state.isCrewFull} onClick={onClick}>Start Mission</button>
      </div>
    )
  }
}

function ShowScenario({ scenario }) {
  const [ stateMap, dispatch ] = useStore();
  const state = new State(stateMap);
  const onClick = (e) => {
    e.preventDefault();
    dispatch('ADD_SCENARIO', { scenario: startScenario(state.nextScenarioIndex(), roll()) });
  }
  const score = scenario.crewScore(state.crew);
  const buffs = [...new Set(state.crew.map(d => scenario.drifterBuffs(d).map(b => b.name)).flat())];
  const isNext = !state.isMissionComplete && scenario.index == state.scenarios.length - 1;
  return (
    <div className="Scenario">
      <h2>{scenario.name} ({scenario.roll})</h2>
      <blockquote className="narrative">{scenario.narrative}</blockquote>
      <div className="results">
        {(score > 0) &&
          <p>Due to your crew's {buffs.join(", ")} ... you scored {score}!</p>
        }
        {(score <= 0 && buffs.length > 0) &&
          <p>Despite your crew's {buffs.join(", ")} ... you were unable to get away with any treasure.</p>
        }
        {(buffs.length == 0) &&
          <p>Your crew was not up to the challenge this time. You've slunk away with your tails between your collective legs, lucky to live to see tomorrow.</p>
        }
      </div>
      {isNext &&
        <div>
          <button onClick={onClick}>Next</button>
        </div>
      }
    </div>
  )
}

function ShowScenarios() {
  const [stateMap, dispatch] = useStore();
  const state = new State(stateMap);
  return (
    <div>
      {state.scenarios.map(s => <div key={s.name}><hr /><ShowScenario scenario={s} /></div>)}
    </div>
  )
}

function ShowResult() {
  const [stateMap, dispatch] = useStore();
  const state = new State(stateMap);
  if (state.isMissionComplete) {
    const finalScore = state.scenarios
      .map(s => s.crewScore(state.crew))
      .reduce((a, s) => (a + s), 0);
    return (
      <div className="ShowResult">
        <hr />
        <h2>Final Result!</h2>
        <p>Your crew got a final score of {finalScore}.</p>
      </div>
    )
  }
}

function Intro() {
  const [stateMap, _] = useStore();
  const state = new State(stateMap);
  if (!state.isMissionStarted) {
    return (
      <div className="Intro">
        <p>
          Remember the <a href="https://compendium.fringedrifters.com/the-great-old-world-treasure-hunt">Great Old World Treasure Hunt</a>?
          Now you can play through it again and again, experimenting with different crews.
          Simply choose a crew of five drifters, by their ID number, and start your mission.
          Each step of the tale will be the same as the original, and your success or failure will depend on the intrinsic attributes of your drifters and how they fare against each situation they'll face.
          However, each run is random, and will be different every time.
        </p>
      </div>
    )
  }
}

function App() {
  return (
    <>
      <header>
        <h1>Void Adventure</h1>
      </header>
      <Intro />
      <CrewSelector />
      <StartMission />
      <ShowScenarios />
      <ShowResult />
    </>
  )
}

export default App
