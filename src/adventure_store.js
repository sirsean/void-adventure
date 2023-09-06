import { initStore } from './store';

export const configureStore = () => {
    const actions = {
        SET_DRIFTER_SLOT: (state, { slotIndex, drifter }) => {
            state.drifterSlots[slotIndex] = drifter;
            return state;
        },
    };

    initStore(actions, {
        drifterSlots: new Array(5),
    });
}