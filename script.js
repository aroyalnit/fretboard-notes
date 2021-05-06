let notes = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
let strings = ['E', 'A', 'D', 'G', 'B']
let variations = ['natural', 'flat', 'sharp']

let variationSymbols = {
  'natural': '',
  'flat': '&flat;',
  'sharp': '&sharp;'
}

let stringSelections = {}
notes.forEach((note) => {
  stringSelections[note] = true
})

let variationSelections = {}
variations.forEach((variation) => {
  variationSelections[variation] = true
})

let timer
let allNotes = []
let index = 0
let cookie
try {
  cookie = JSON.parse(document.cookie.split(';')[0])
}
catch(e) {
  cookie = false
}

if (cookie) {
  if (cookie.variationSelections !== undefined) {
    variationSelections = cookie.variationSelections
  }
  if (cookie.stringSelections !== undefined) {
    stringSelections = cookie.stringSelections
  }
}
window.onload = function() {
  setCheckboxes()
  document.getElementById("content").addEventListener("click", function(e){
    doNextNote()
  })

  document.getElementById("settings-menu").addEventListener("click", function(e) {
    let currentDisplay = window.getComputedStyle(document.getElementById("settings-expand"), null).getPropertyValue("display")
    let newDisplay = currentDisplay == 'none' ? 'inline' : 'none'
    document.getElementById("settings-expand").style.display = newDisplay
  })

  document.getElementById('currentNote').innerHTML = allNotes[index]
  document.getElementById('nextNote').innerHTML = `NEXT (${index+1} of ${allNotes.length})`
  setTimer()
  try {
    navigator.wakeLock.request('screen')
  } catch (err) {
    console.error(`${err.name}, ${err.message}`)
  }

  let stringForm = document.getElementById('strings')
  stringForm.addEventListener('change', (event) => {
    let elements = stringForm.elements
    strings.forEach((string) => {
      stringSelections[string] = elements[string].checked
    })
    setAllNotes()
    setPreferences()
  })

  let variationsForm = document.getElementById('variations')
  variationsForm.addEventListener('change', (event) => {
    let elements = variationsForm.elements
    variations.forEach((variation) => {
      variationSelections[variation] = elements[variation].checked
    })
    setAllNotes()
    setPreferences()
  })
  setAllNotes()
}



function setCheckboxes() {
  let stringForm = document.getElementById('strings')
  let variationsForm = document.getElementById('variations')

  let stringElements = stringForm.elements
  let variationElements = variationsForm.elements

  strings.forEach((string) => {
    stringElements[string].checked = stringSelections[string]
  })

  variations.forEach((variation) => {
    variationElements[variation].checked = variationSelections[variation]
  })
}

function setPreferences() {
  let combinedPreferences = {
    stringSelections: stringSelections,
    variationSelections: variationSelections
  }
  document.cookie = JSON.stringify(combinedPreferences)
}

function setAllNotes()
{
  allNotes = []
  strings.forEach((string) => {
    if (stringSelections[string]) {
      notes.forEach((note) => {
        variations.forEach((variation) => {
          if (variationSelections[variation]) {
            allNotes.push(`<b>${note}${variationSymbols[variation]}</b> on <b>${string}</b> string`)
          }
        })
      })
    }
  })
  reset()
}

function reset() {
  index = 0
  allNotes = allNotes.sort( () => .5 - Math.random())
  doNextNote()
}

function doNextNote() {
  relax()
  index++
  if (index == allNotes.length) {
    document.getElementById('currentNote').innerHTML = 'ALL COMPLETE!'
    document.getElementById('nextNote').innerHTML = `Reset: ${allNotes.length} complete`
  }
  else if (index > allNotes.length) {
    index = 0;
    doNextNote()
  }
  else {
    setTimer()
    document.getElementById('currentNote').innerHTML = allNotes[index]
    document.getElementById('nextNote').innerHTML = `NEXT (${index+1} of ${allNotes.length})`
  }
}

function setTimer() {
  timer = setTimeout(() => {
    panic()
  }, 4000)
}

function relax() {
  clearTimeout(timer)
  document.body.style.background = 'white'
}

function panic() {
  document.body.style.background = 'red'
}
