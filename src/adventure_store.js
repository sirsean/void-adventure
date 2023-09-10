import { NUM_SCENARIOS } from './scenarios';
import { initStore } from './store';

export class State {
    constructor(state) {
        this.drifterSlots = state.drifterSlots;
        this.scenarios = state.scenarios;
    }

    getDrifter(index) {
        return this.drifterSlots[index];
    }
    
    isDrifterInCrew(drifterId) {
        return this.drifterSlots.filter(d => d.id == drifterId).length > 0;
    }

    get crewSize() {
        return this.drifterSlots.filter(d => !!d).length;
    }

    get isCrewFull() {
        return this.crewSize == this.drifterSlots.length;
    }

    get crew() {
        if (this.isCrewFull) {
            return this.drifterSlots;
        } else {
            return [];
        }
    }

    nextScenarioIndex() {
        return this.scenarios.length;
    }

    getScenario(index) {
        return this.scenarios[index];
    }

    isCurrentScenarioIndex(index) {
        return index == this.scenarios.length - 1;
    }

    get isMissionStarted() {
        return this.scenarios.length > 0;
    }

    get isMissionComplete() {
        return this.scenarios.length == NUM_SCENARIOS;
    }
}

export const configureStore = () => {
    const actions = {
        SET_DRIFTER_SLOT: (state, { slotIndex, drifter }) => {
            const inCrew = state.drifterSlots.filter(d => d.id == drifter.id).length > 0;
            if (!inCrew) {
                state.drifterSlots[slotIndex] = drifter;
            }
            return state;
        },
        ADD_SCENARIO: (state, { scenario }) => {
            if (scenario) {
                state.scenarios.push(scenario);
            }
            return state;
        },
        RESET_SCENARIOS: (state, _) => {
            state.scenarios = new Array();
            return state;
        }
    };

    initStore(actions, {
        drifterSlots: new Array(5),
        scenarios: new Array(),
    });
}