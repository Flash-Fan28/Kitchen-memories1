<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#f3eee5" />
  <title>Kitchen Echoes | A Sensory Memory Game</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@500;600;700&family=ZCOOL+XiaoWei&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  <div class="grain"></div>

  <main id="intro" class="intro screen active">
    <div class="intro-copy">
      <p class="eyebrow">A SENSORY MEMORY GAME</p>
      <h1>Kitchen<br><span>Echoes</span></h1>
      <p class="intro-text">A murmur at six, a bright rhythm at noon, a lingering trace in the afternoon, and something bittersweet after dark. Follow the kitchen clock and gather what your family left behind.</p>
      <div class="intro-actions">
        <button id="startBtn" class="primary-btn">Enter the kitchen <span>→</span></button>
        <button id="rulesBtn" class="text-btn">How to play</button>
      </div>
    </div>
    <div class="intro-visual" aria-hidden="true">
      <div class="sun"></div>
      <div class="counter">
        <div class="kettle"></div>
        <div class="steam steam-a">～</div><div class="steam steam-b">～</div>
        <div class="cup"></div>
      </div>
      <div class="window-lines"></div>
      <p>Some forms of love are never spoken.</p>
    </div>
  </main>

  <main id="game" class="game screen">
    <header class="topbar">
      <a href="#" class="brand" id="homeBtn"><span>Kitchen</span> Echoes</a>
      <div class="chapter"><i></i><span>CHAPTER ONE · THE KITCHEN CLOCK</span><i></i></div>
      <button id="soundBtn" class="icon-btn" aria-label="Ambient sound">♪</button>
    </header>

    <section class="game-layout">
      <aside class="players-panel">
        <p class="panel-kicker">THE FAMILY</p>
        <h2>Who came into<br>the kitchen today?</h2>
        <div id="playerList" class="player-list"></div>
        <div class="progress-card">
          <div><span>Shared memories</span><b id="totalClues">0 / 20</b></div>
          <div class="progress-track"><i id="progressBar"></i></div>
          <small>Gather every sensory trace and the family's whole memory will return.</small>
        </div>
      </aside>

      <section class="board-section">
        <div class="board-wrap">
          <div id="board" class="board" aria-label="Clock-shaped game board">
            <div class="clock-face">
              <span class="clock-time t12">12</span><span class="clock-time t3">3</span>
              <span class="clock-time t6">6</span><span class="clock-time t9">9</span>
              <div class="clock-hand"></div>
              <div class="board-center">
                <span id="centerIcon">♨</span>
                <p id="centerLabel">The kitchen still holds<br>the warmth of today</p>
              </div>
            </div>
          </div>
          <div class="board-caption"><span>06:00</span> A day begins with a quiet sound <i></i></div>
        </div>
      </section>

      <aside class="action-panel">
        <div class="turn-head">
          <div><p>Current turn</p><h2 id="turnName">Father</h2></div>
          <span id="turnBadge" class="role-badge">DAWN · 06:00</span>
        </div>

        <div class="memory-card">
          <div class="memory-top"><span>Clues discovered</span><b id="clueCount">0 / 3</b></div>
          <div id="latestClue" class="clue-empty">
            <span class="sense-symbol">⌁</span>
            <p>Roll the die and search the clock<br>for this person's sensory traces.</p>
          </div>
        </div>

        <div class="dice-area">
          <div id="dice" class="dice" data-value="1" aria-label="Die">
            <i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i>
          </div>
          <button id="rollBtn" class="roll-btn">Roll the die</button>
          <p id="diceHint">Roll a 6 to move again</p>
        </div>

        <button id="guessBtn" class="guess-btn" disabled>Guess the object <span>→</span></button>
        <button id="journalBtn" class="journal-btn">Open sensory journal <span id="journalCount">0</span></button>
      </aside>
    </section>
  </main>

  <div id="rulesModal" class="modal" role="dialog" aria-modal="true">
    <div class="modal-card rules-card">
      <button class="close-btn" data-close>×</button>
      <p class="modal-kicker">HOW TO PLAY</p>
      <h2>Follow a trace. Remember a person.</h2>
      <ol>
        <li><b>Take turns</b><span>Each family member begins at the time they entered the kitchen. Move clockwise; a 6 grants another roll.</span></li>
        <li><b>Gather senses</b><span>Land on a space matching your character's colour to uncover a sight, sound, touch, scent, or taste.</span></li>
        <li><b>Guess the object</b><span>After three clues, you may guess. A correct answer reveals the story and destination; a wrong one locks guessing for one turn.</span></li>
        <li><b>Return it home</b><span>Reach the revealed location to return the object. When only one remains, the final memory returns without another roll.</span></li>
      </ol>
      <button class="primary-btn" data-close>I'm ready</button>
    </div>
  </div>

  <div id="guessModal" class="modal" role="dialog" aria-modal="true">
    <div class="modal-card guess-card">
      <button class="close-btn" data-close>×</button>
      <p class="modal-kicker">WHAT IS LEFT BEHIND?</p>
      <h2>What object did <span id="guessRole">Father</span> leave behind?</h2>
      <div id="guessOptions" class="guess-options"></div>
      <p class="guess-note">Take your time. The object is only a doorway; what matters is the warmth it kept for someone.</p>
    </div>
  </div>

  <div id="journalModal" class="modal" role="dialog" aria-modal="true">
    <div class="modal-card journal-card">
      <button class="close-btn" data-close>×</button>
      <p class="modal-kicker">SENSORY JOURNAL</p>
      <h2>Sensory Journal</h2>
      <div id="journalTabs" class="journal-tabs"></div>
      <div id="journalContent" class="journal-content"></div>
    </div>
  </div>

  <div id="storyModal" class="modal story-modal" role="dialog" aria-modal="true">
    <div class="modal-card story-card">
      <p id="storyTime" class="modal-kicker">DAWN · 06:00</p>
      <div id="storyObject" class="story-object">♨</div>
      <p class="story-found">YOU REMEMBERED</p>
      <h2 id="storyTitle">Father's kettle</h2>
      <p id="storyText"></p>
      <div class="story-location"><span>The object's place is revealed</span><b id="storyLocation">09:00 on the clock</b></div>
      <button id="storyContinue" class="primary-btn">Carry the memory onward</button>
    </div>
  </div>

  <div id="endingModal" class="modal ending-modal" role="dialog" aria-modal="true">
    <div class="modal-card ending-card">
      <p class="modal-kicker">THE KITCHEN REMEMBERS</p>
      <div class="ending-mark">✦</div>
      <h2 id="endingTitle">Every memory has returned</h2>
      <p id="endingLead">Congratulations—you gathered every sensory memory held by the kitchen.</p>
      <div id="endingStories" class="ending-stories"></div>
      <button id="restartBtn" class="primary-btn">Experience the memories again</button>
    </div>
  </div>

  <div id="toast" class="toast"></div>
  <script src="app.js"></script>
</body>
</html>
