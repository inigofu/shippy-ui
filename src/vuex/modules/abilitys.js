import { Ability } from '@casl/ability'

export const ability = new Ability()

export const abilityPlugin = (store) => {
  ability.update(store.state.user.rules)

  return store.subscribe((mutation) => {
    switch (mutation.type) {
      case 'user/settules':
        ability.update(mutation.payload)
        console.log('ability', ability, mutation.payload)
        break
      case 'user/removetoken':
        ability.update([{ actions: 'read', subject: 'all' }])
        break
    }
  })
}
