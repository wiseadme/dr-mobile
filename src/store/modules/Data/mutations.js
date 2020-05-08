import * as mutation from '../../MutationTypes'

export default {
  [mutation.SET_EVENT_DATES](state, eventDates) {
    state.eventDates = eventDates
  },

  [mutation.SET_EVENTS](state, events) {
    state.events = events
  }
}
