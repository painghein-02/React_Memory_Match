import React, { useState, useEffect } from "react";

const TOTAL_PAIRS = 10;
const INITIAL_LIVES = 10;

export default function MemoryMatching() {
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matches, setMatches] = useState(0);
  const [lives, setLives] = useState(INITIAL_LIVES);
  const [gameStatus, setGameStatus] = useState("playing");

  useEffect(() => {
    const initializeGame = () => {
      let initialCards = [];
      for (let i = 1; i <= TOTAL_PAIRS; i++) {
        initialCards.push(i, i);
      }

      for (let i = initialCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [initialCards[i], initialCards[j]] = [initialCards[j], initialCards[i]];
      }

      setCards(
        initialCards.map((number, index) => ({
          id: index,
          number: number,
          isMatched: false,
        })),
      );
    };

    initializeGame();
  }, []);

  const handleCardClick = (index) => {
    if (
      gameStatus !== "playing" ||
      cards[index].isMatched ||
      flippedIndices.includes(index)
    ) {
      return;
    }

    let currentFlipped = [...flippedIndices];

    if (currentFlipped.length === 2) {
      currentFlipped = [];
    }

    currentFlipped.push(index);
    setFlippedIndices(currentFlipped);

    if (currentFlipped.length === 2) {
      const [firstIndex, secondIndex] = currentFlipped;

      if (cards[firstIndex].number === cards[secondIndex].number) {
        setMatches((prev) => prev + 1);
        setCards((prev) => {
          const newCards = [...prev];
          newCards[firstIndex].isMatched = true;
          newCards[secondIndex].isMatched = true;
          return newCards;
        });
        setFlippedIndices([]);

        if (matches + 1 === TOTAL_PAIRS) {
          setGameStatus("win");
        }
      } else {
        // No match found
        setLives((prev) => {
          const newLives = prev - 1;
          if (newLives === 0) setGameStatus("lose");
          return newLives;
        });
        // Note: We leave the indices in `flippedIndices` so they remain visible
        // until the next click, fulfilling the instruction.
      }
    }
  };

  // Handle clicking "anywhere else" to hide unmatched cards
  const handleBoardClick = (e) => {
    if (flippedIndices.length === 2 && !e.target.closest(".memory-card")) {
      setFlippedIndices([]);
    }
  };

  return (
    <div style={styles.container} onClick={handleBoardClick}>
      <h2 style={styles.title}>Memory Matching</h2>

      <div style={styles.grid}>
        {cards.map((card, index) => {
          const isRevealed = card.isMatched || flippedIndices.includes(index);
          const isJustFlipped = flippedIndices.includes(index);

          return (
            <div
              key={card.id}
              className="memory-card"
              onClick={() => handleCardClick(index)}
              style={{
                ...styles.card,
                borderColor: isJustFlipped ? "#8b8aff" : "#ccc", // Mimics the purple/blue outline in the screenshot
              }}
            >
              {isRevealed ? card.number : ""}
            </div>
          );
        })}
      </div>

      <div style={styles.statsContainer}>
        <span>Match: {matches}</span>
        <span>Live: {lives}</span>
      </div>

      {gameStatus === "win" && <h3 style={{ color: "green" }}>You Win!</h3>}
      {gameStatus === "lose" && (
        <h3 style={{ color: "red" }}>Game Over! You Lost.</h3>
      )}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontFamily: "sans-serif",
    marginTop: "40px",
  },
  title: {
    color: "#8b8aff",
    fontWeight: "normal",
    marginBottom: "20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 70px)",
    gap: "20px",
    marginBottom: "30px",
  },
  card: {
    width: "70px",
    height: "90px",
    border: "2px solid",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "24px",
    cursor: "pointer",
    backgroundColor: "white",
    userSelect: "none",
  },
  statsContainer: {
    display: "flex",
    width: "340px",
    justifyContent: "space-between",
    borderTop: "1px solid #eee",
    paddingTop: "20px",
    fontSize: "14px",
    color: "#555",
  },
};
