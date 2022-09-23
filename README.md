<!-- <Your game's title>: A description of your game. Background info of the game is a nice touch. -->
# ![mine](/images/mine.png) Minesweeper ![mine](/images/mine.png)
A clone of the beloved computer game that helped train users how to left and right click.

This was created for Project 1 of General Assembly's Software Engineering Immersive course. I chose to do Minesweeper since it's a game I've been playing from the days of dial-up internet and AOL.

<!-- Screenshot(s): Images of your actual game. -->
## Screenshots
Initial board state:
![inital board state](/images/initial.png)
Midgame:
![midgame](/images/midgame.png)
Win screen with sunglasses smiley:
![won](/images/win.png)
Lose screen:
![lost](/images/lose.png)

<!-- Technologies Used: List of the technologies used, e.g., JavaScript, HTML, CSS... -->
## Technologies Used
* Javascript to script the game
* CSS to display the game and page
* HTML to deliver the page content

<!-- Getting Started: In this section include the link to your deployed game and any instructions you deem important. -->
## Getting Started
To play the game, click [here](https://schen044.github.io/minesweeper/).

### How to Play
Reveal all the safe squares to clear the board and win.

Left click on a tile to reveal what kind of tile it is. If the tile is a mine, the game ends in a loss, revealing the locations of where the mines are. If the tile is safe and not a mine, a hint is shown for how many adjacent tiles contains a mine.

Right click on a tile to flag it as a mine. Right click again to remove the flag. Flagging all of the mines is not needed to win the game.

Left clicking on the smiley face at the top of the board will reset the game. This will not reset the win counter.

<!-- Next Steps: Planned future enhancements (icebox items). -->
## Future Improvements
- [ ] **Fix the infinite loop that freezes JS**
- [ ] A timer that tracks how long it takes to clear the board
- [ ] Different size boards and different number of mines to change difficulty
- [ ] Double click to reveal multiple tiles at once, allowing the player to be more click efficient and to speedrun clearing the board.