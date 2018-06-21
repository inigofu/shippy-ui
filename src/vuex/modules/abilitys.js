import { Ability } from '@casl/ability'

export const ability = new Ability()

export const abilityPlugin = (store) => {
  ability.update(store.state.rules)

  return store.subscribe((mutation) => {
    switch (mutation.type) {
      case 'login':
        ability.update(mutation.payload.rules)
        break
      case 'logout':
        ability.update([{ actions: 'read', subject: 'all' }])
        break
    }
  })
}
