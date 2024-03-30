import React, { useState, useEffect } from "react";
import "./App.css";

const MAP_WIDTH = 10;
const MAP_HEIGHT = 10;
const TILE_SIZE = 40;

//233+144+89+55+34+21+21+21+13+8+5+3+3+3+13
const ENEMY_POSITIONS = [
  { x: MAP_WIDTH - 1, y: 0, number: 233 }, //
  { x: MAP_WIDTH - 1, y: 5, number: 777 },
  { x: MAP_WIDTH - 1, y: 2, number: 444 },
  { x: MAP_WIDTH + MAP_WIDTH, y: 1, number: 144 }, //
  { x: MAP_WIDTH + MAP_WIDTH * 2, y: 5, number: 89 }, //
  { x: MAP_WIDTH + MAP_WIDTH * 3, y: 7, number: 55 }, //

  { x: MAP_WIDTH + MAP_WIDTH * 3, y: 5, number: 15 },
  { x: MAP_WIDTH + MAP_WIDTH * 3, y: 2, number: 4 },

  { x: MAP_WIDTH + MAP_WIDTH * 4, y: 3, number: 34 }, //
  { x: MAP_WIDTH + MAP_WIDTH * 5, y: 7, number: 21 }, //
  { x: MAP_WIDTH + MAP_WIDTH * 6, y: 7, number: 21 }, //

  { x: MAP_WIDTH + MAP_WIDTH * 5, y: 3, number: 77 },
  { x: MAP_WIDTH + MAP_WIDTH * 6, y: 1, number: 15 },

  { x: MAP_WIDTH + MAP_WIDTH * 7, y: 7, number: 21 }, //
  { x: MAP_WIDTH + MAP_WIDTH * 8, y: 3, number: 13 }, //

  { x: MAP_WIDTH + MAP_WIDTH * 8, y: 7, number: 21 },
  { x: MAP_WIDTH + MAP_WIDTH * 8, y: 1, number: 3 },

  { x: MAP_WIDTH + MAP_WIDTH * 9, y: 5, number: 13 }, //
  { x: MAP_WIDTH + MAP_WIDTH * 10, y: 6, number: 8 }, //

  { x: MAP_WIDTH + MAP_WIDTH * 10, y: 5, number: 15 },
  { x: MAP_WIDTH + MAP_WIDTH * 10, y: 2, number: 4 },

  { x: MAP_WIDTH + MAP_WIDTH * 11, y: 6, number: 5 }, //
  { x: MAP_WIDTH + MAP_WIDTH * 12, y: 6, number: 3 }, //
  { x: MAP_WIDTH + MAP_WIDTH * 13, y: 6, number: 3 }, //

  { x: MAP_WIDTH + MAP_WIDTH * 13, y: 6, number: 15 },
  { x: MAP_WIDTH + MAP_WIDTH * 13, y: 6, number: 1 },

  { x: MAP_WIDTH + MAP_WIDTH * 14, y: 6, number: 3 }, //

  { x: MAP_WIDTH + MAP_WIDTH * 14, y: 5, number: 3 },
  { x: MAP_WIDTH + MAP_WIDTH * 14, y: 2, number: 9 },
];

const ENEMY_SPEED = 600;

function App() {
  const [OPERATIONS, setOper] = useState([
    { id: 1, oper: 5, type: "+" },
    { id: 2, oper: 5, type: "-" },
    { id: 3, oper: 5, type: "+" },
    { id: 4, oper: 44, type: "+" },
    { id: 5, oper: 5, type: "+" },
  ]);
  const [hero_number, setHero_number] = useState(0);

  useEffect(() => {
    if (hero_number === 666) {
      set_isWin(true);
    }
  }, [hero_number]);

  const [isWin, set_isWin] = useState(false);

  const [heroPosition, setHeroPosition] = useState({ x: 0, y: 0 });
  const [enemies, setEnemies] = useState(ENEMY_POSITIONS);

  const [current_order_select, setcur_OrderSel] = useState(1);
  const [current_order, setcur_Order] = useState(0);
  const [next_operation, set_Next_oper] = useState(0);

  const [order, setOrder] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setEnemies((prevEnemies) => {
        const newEnemies = prevEnemies.map((enemy) => ({
          ...enemy,
          x: enemy.x - 1,
        }));
        return newEnemies;
      });
    }, ENEMY_SPEED);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const collision = enemies.find(
      (enemy) => enemy.x === heroPosition.x && enemy.y === heroPosition.y
    );
    const operation = enemies.find(
      (enemy) => enemy.x - 1 === heroPosition.x && enemy.y === heroPosition.y
    );

    if (collision) {
      setHero_number(hero_number + collision.number);
    }

    if (operation && false) {
      let oper = OPERATIONS.find((e) => e.id === order[current_order]);
      setHero_number(hero_number + oper.oper);

      console.log("oper");
      console.log(oper);

      let next_position = 0;
      if (oper.type === "-") {
        next_position = heroPosition.y - oper.oper;
      } else if (oper.type === "+") {
        next_position = heroPosition.y + oper.oper;
      }
      console.log("next_position");
      console.log(next_position);
      setHeroPosition((prevPosition) => ({
        ...prevPosition,
        y: next_position,
      }));
      setcur_Order(current_order + 1);
    }
  }, [heroPosition, enemies]);

  const handleKeyDown = (e) => {
    switch (e.key) {
      case "ArrowUp":
        setHeroPosition((prevPosition) => ({
          ...prevPosition,
          y: Math.max(0, prevPosition.y - 1),
        }));
        break;
      case "ArrowDown":
        setHeroPosition((prevPosition) => ({
          ...prevPosition,
          y: Math.min(MAP_HEIGHT - 1, prevPosition.y + 1),
        }));
        break;
      /*case "ArrowLeft":
        setHeroPosition((prevPosition) => ({
          ...prevPosition,
          x: Math.max(0, prevPosition.x - 1),
        }));
        break;
      case "ArrowRight":
        setHeroPosition((prevPosition) => ({
          ...prevPosition,
          x: Math.min(MAP_WIDTH - 1, prevPosition.x + 1),
        }));
        break;*/
      default:
        break;
    }
  };

  const renderMap = () => {
    const rows = [];
    for (let y = 0; y < MAP_HEIGHT; y++) {
      const cells = [];
      for (let x = 0; x < MAP_WIDTH; x++) {
        cells.push(
          <div
            key={`${x}-${y}`}
            className={`cell ${
              x === heroPosition.x && y === heroPosition.y ? "hero" : ""
            } ${
              enemies.find((enemy) => enemy.x === x && enemy.y === y)
                ? "enemy"
                : ""
            }`}
          >
            {heroPosition.x === x && heroPosition.y === y ? hero_number : ""}

            {enemies.find((enemy) => enemy.x === x && enemy.y === y)?.number}
          </div>
        );
      }
      rows.push(
        <div key={y} className="row">
          {cells}
        </div>
      );
    }
    return rows;
  };

  return (
    <div className="App" tabIndex={0} onKeyDown={handleKeyDown}>
      {isWin ? (
        <div className="win_wrap">
          Победа!
          <p>Поздравляем, отважные и исследовательски настроенные туристы! <br /> Вы успешно завершили наш захватывающий квест в районе Гванаксан в Пусане! <br /> Ваша отвага, смекалка и командный дух привели вас к заветной победе. <br /> Теперь вы не только исследователи, но и герои этого захватывающего приключения! <br />Наслаждайтесь своими заслуженными победами и продолжайте исследовать удивительный мир вокруг себя!
          </p>
        </div>
      ) : (
        <></>
      )}
      <div className="oper__wrap">
        <p>
          Большой брат говорит: <br />- Ты главный руководитель министерства
          бога, сделай себя божьим числом.
        </p>
        <p style={{ fontSize: "10px" }}>iccanobif</p>
        {/*OPERATIONS.map((operation1) => {
            let a = order.findIndex(
              (ord) => ord === operation1.id
            );
            if (a >-1) {
              return (
                <div>
                  <span>{a}</span> {operation1.type} {operation1.oper}
                </div>
              );
            } else {
              return (
                <div onClick={()=>{
                  setOrder([...order, operation1.id])
                }}>
                  {operation1.type} {operation1.oper}
                </div>
              );
            }
          }) */}
      </div>

      <div className="control">
        <div
          onClick={() =>
            setHeroPosition((prevPosition) => ({
              ...prevPosition,
              y: Math.max(0, prevPosition.y - 1),
            }))
          }
        >
          <img src="/arrow-up.png" alt="" />
        </div>
        <div
          onClick={() =>
            setHeroPosition((prevPosition) => ({
              ...prevPosition,
              y: Math.min(MAP_HEIGHT - 1, prevPosition.y + 1),
            }))
          }
        >
          <img src="/down.png" alt="" />
        </div>
      </div>
      {renderMap()}
    </div>
  );
}

export default App;
