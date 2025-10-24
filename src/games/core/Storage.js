const NS = 'casma'
export const storage = {
  get(key, fallback=null){
    try { const v = localStorage.getItem(`${NS}.${key}`); return v? JSON.parse(v) : fallback } catch { return fallback }
  },
  set(key, value){ localStorage.setItem(`${NS}.${key}`, JSON.stringify(value)) },
  remove(key){ localStorage.removeItem(`${NS}.${key}`) }
}