1. Game Choice:
Minesweeper

2. Wireframe:
![minesweeper wireframe](https://i.imgur.com/zUHPVBU.png)

3. Pseudocode:
<h3>MVP</h3>

- As a user, I want to be able to flag mines
- As a user, when I click on a board square, I want to see the revealed tiles
- As a user, I want a restart button
- As a user, I want the game to be solvable
- As a user, I want to see the number of flags used
<br><br>

<h2>** Icebox Features **</h2>

- As a user, I want to see the elapsed time
- As a user, I want to be able to choose the difficulty (size, number of mines)
- As a user, I want to see the smiley face change after winning or losing
- As a user, I want to double click to remove multiple squares at once
- As a user, I want to see the board animate and change after clicking
- As a user, I want to see a mole themed board
<br><br>

<h2>** Pseudocode **</h2>

* When starting a game of Minesweeper:
	* initialize the board state to be empty **[ ```init()``` ]**
	* set the number of flags/mines
	* render the game state to the DOM **[ ```render()``` ]**
<br><br>

* When a player first clicks
	* we need to generate the mines and hints **[ ```createBoard()``` ]**
		* this is to prevent the player from losing immediately
	* **update the board state** to reveal adjacent hints  **[ ```handleClick()``` ]**
	* render the game state to the DOM **[ ```render()``` ]**
<br><br>

* After the first click
	* if a player left clicks the board, we need to check if the player clicked a mine
	* if not, then **update the board state** to reveal adjacent hints  **[ ```handleClick()``` ]**
	* if a player right-clicks the board, we need to **update the board state** to mark the space as flagged **[ ```handleRClick()``` ]**
	* then decrement the flag count
	* render the game state to the DOM **[ ```render()``` ]**
<br><br>

* When the game is over
	* check if flag locations match mine locations **[ ```checkMine()``` ]**
	* **update the board state** to reveal the locations of all mines **[ ```showSolution()```]***
	* render a win/lose message to the DOM **[ ```render()``` ]**
	* reinitialize the state of the game if the player clicks the reset button **[ ```init()``` ]**
<br><br>

<h2>** Application State Data **</h2>

* board (potentially an array with 25 objects, one array with 5 nested arrays with 5 objects each 
	* we will go with a single array with 25 objects (board) (easier to work with since elements are easier to access)
```js
const board = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12....]
const otherBoard = [
[0, 1, 2, 3, 4]
[5, 6, 7, 8, 9]
[10, 11, 12, 13, 14]...
]
```
* win (potentially strings storing 'win', 'lose', potentially booleans, null (for no winner, game is still going))
	* we will go with ints: win = 1, lose = 0, ongoing = null
<br><br>

<h2>** Application Constant Data **</h2>

* number of mines (int to make it easy to decrement)
<br><br>

<h2>** Extra Notes **</h2>

![notes](https://i.imgur.com/Zw1o1cM.jpg?1)