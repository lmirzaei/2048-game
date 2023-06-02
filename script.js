import Grid from "./Grid.js"
import Tile from "./Tile.js"

const gameBoard = document.getElementById("game-board");
const grid = new Grid(gameBoard)


grid.randomEmptyCell().tile = new Tile(gameBoard)
grid.randomEmptyCell().tile = new Tile(gameBoard)
setupInput()
console.log(grid.cellsByColumn)
function setupInput() {
  window.addEventListener("keydown", handleInput, { once: true })


}

async function handleInput(e) {
  console.log(e.key)
  switch (e.key) {
    case "ArrowUp":
      await moveUp()
      break
    case "ArrowDown":
      await moveDown()
      break
    case "ArrowLeft":
      await moveLeft()
      break
    case "ArrowRight":
      await moveRight()
      break
    default:
      setupInput()
      return
  }
  // At this point in the code, we have finished a movement. During the movement, the mergeTile
  // is stored in the mergeTile variables. However, after completing the movement, our
  // objective is to eliminate these merge tiles and merge them together to form the larger tiles.
  grid.cells.forEach(cell => cell.mergeTiles())
  const newTile = new Tile(gameBoard)
  grid.randomEmptyCell().tile = newTile
  setupInput()
}

function moveUp() {
  return slideTiles(grid.cellsByColumn)
  // We call the function "slideTiles" to handle all of our movements. Behind the
  // scenes, there is an animation happening on the CSS side, but we do not wait for that animation to complete.
  // To wait for the animation to complete, we should set up a waiting setting for movement. To do this we should make
  // the function async. add await for calling move functions, and add a promise return value.
  // why promise return value? Because the keyword "async" before a function makes the function return a promise.
}

function moveDown() {
  return slideTiles(grid.cellsByColumn.map(column => [...column].reverse()))
}

function moveRight() {
  return slideTiles(grid.cellsByRow.map(row => [...row].reverse()))
}

function moveLeft() {
  return slideTiles(grid.cellsByRow)
}

function slideTiles(cells) {
  return Promise.all(
    cells.flatMap(group => {
      const promises = []
      for (let i = 1; i < group.length; i++) {
        const cell = group[i]
        if (cell.tile == null) continue
        let lastValidCell
        for (let j = i - 1; j >= 0; j--) {
          const moveToCell = group[j]
          if (!moveToCell.canAccept(cell.tile)) break
          lastValidCell = moveToCell
        }

        if (lastValidCell != null) {
          promises.push(cell.tile.waitForTransition())
          if (lastValidCell.tile != null) {
            lastValidCell.mergeTile = cell.tile
          } else {
            lastValidCell.tile = cell.tile
          }
          cell.tile = null
        }
      }
      return promises
    })
  )
}


// import Grid from "./Grid.js"
// import Tile from "./Tile.js"

// const gameBoard = document.getElementById("game-board")

// const grid = new Grid(gameBoard)
// grid.randomEmptyCell().tile = new Tile(gameBoard)
// grid.randomEmptyCell().tile = new Tile(gameBoard)
// setupInput()
// console.log(grid.cellsByColumn)
// console.log(grid.cellsByRow)

// function setupInput() {
//   window.addEventListener("keydown", handleInput, { once: true })
// }

// async function handleInput(e) {
//   console.log(e.key)
//   switch (e.key) {
//     case "ArrowUp":
//       if (!canMoveUp()) {
//         setupInput()
//         return
//       }
//       await moveUp()
//       break
//     case "ArrowDown":
//       if (!canMoveDown()) {
//         setupInput()
//         return
//       }
//       await moveDown()
//       break
//     case "ArrowLeft":
//       if (!canMoveLeft()) {
//         setupInput()
//         return
//       }
//       await moveLeft()
//       break
//     case "ArrowRight":
//       if (!canMoveRight()) {
//         setupInput()
//         return
//       }
//       await moveRight()
//       break
//     default:
//       setupInput()
//       return
//   }

//   grid.cells.forEach(cell => cell.mergeTiles())

//   const newTile = new Tile(gameBoard)
//   grid.randomEmptyCell().tile = newTile

//   if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
//     newTile.waitForTransition(true).then(() => {
//       alert("You lose")
//     })
//     return
//   }

//   setupInput()
// }

// function moveUp() {
//   return slideTiles(grid.cellsByColumn)
// }

// function moveDown() {
//   return slideTiles(grid.cellsByColumn.map(column => [...column].reverse()))
// }

// function moveLeft() {
//   return slideTiles(grid.cellsByRow)
// }

// function moveRight() {
//   return slideTiles(grid.cellsByRow.map(row => [...row].reverse()))
// }

// function slideTiles(cells) {
//   return Promise.all(
//     cells.flatMap(group => {
//       const promises = []
//       for (let i = 1; i < group.length; i++) {
//         const cell = group[i]
//         if (cell.tile == null) continue
//         let lastValidCell
//         for (let j = i - 1; j >= 0; j--) {
//           const moveToCell = group[j]
//           if (!moveToCell.canAccept(cell.tile)) break
//           lastValidCell = moveToCell
//         }

//         if (lastValidCell != null) {
//           promises.push(cell.tile.waitForTransition())
//           if (lastValidCell.tile != null) {
//             lastValidCell.mergeTile = cell.tile
//           } else {
//             lastValidCell.tile = cell.tile
//           }
//           cell.tile = null
//         }
//       }
//       return promises
//     })
//   )
// }

// function canMoveUp() {
//   return canMove(grid.cellsByColumn)
// }

// function canMoveDown() {
//   return canMove(grid.cellsByColumn.map(column => [...column].reverse()))
// }

// function canMoveLeft() {
//   return canMove(grid.cellsByRow)
// }

// function canMoveRight() {
//   return canMove(grid.cellsByRow.map(row => [...row].reverse()))
// }

// function canMove(cells) {
//   return cells.some(group => {
//     return group.some((cell, index) => {
//       if (index === 0) return false
//       if (cell.tile == null) return false
//       const moveToCell = group[index - 1]
//       return moveToCell.canAccept(cell.tile)
//     })
//   })
// }
