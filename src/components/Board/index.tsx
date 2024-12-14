import { useEffect, useState } from "react";

import styles from "./styles.module.css";
import fieldNames from "../../boardFields";
import { FieldState, BoardState } from "../../boardState";
import BoardSettings, { BoardSettingsProps } from "../BoardSettings";
//import BoardField from "./boardField";

import BoardField from "./BoardField";

/** Координаты точки */
interface Point {
  x: number
  y: number
}

/** Полигон */
interface Polygon {
  points: Point[],
  fill: string,
  id: string,
  center: Point,
  minRadius: number,
}

export default function Board() {
  const [center, setCenter] = useState({ x: 200, y: 200 });
  const [radius, setRadius] = useState(180);
  const [midRadiusZoom1, setMidRadiusZoom1] = useState(1);
  const [midRadiusZoom2, setMidRadiusZoom2] = useState(1);
  const [points, setPoints] = useState([]);
  const [polygons, setPolygons] = useState([]);
  const [pieceRadius, setPieceRadius] = useState(10);

  const boardState = new BoardState();
  const [board, setBoard] = useState(boardState.state);

  const [selectedPolygon, setSelectedPolygon] = useState(null);

  boardState.addEventListener("stateUpdated", () => {
    setBoard(boardState.state);
  });

  /**
   * Поворачивает точку относительно центра
   * @param p - Точка, которую следует вращать
   * @param deg - Угол в градусах
   * @returns Точка с новыми координатами
   */
  function rotate(p: Point, deg: number): Point {
    let cos = Math.cos((Math.PI / 180) * deg);
    let sin = Math.sin((Math.PI / -180) * deg);
    let x = (p.x - center.x) * cos + (p.y - center.y) * sin + center.x;
    let y = (p.y - center.y) * cos - (p.x - center.x) * sin + center.y;
    return { x, y };
  }

  /**
   * Возвращает координаты точки, разделяющей отрезок в указанном соотношении
   * @param p1 Начало отрезка
   * @param p2 Конец отрезка
   * @param ratio Соотношение полученных частей
   */
  function getRatioDividePoint(p1: Point, p2: Point, ratio: number): Point {
    let x = (p1.x + ratio * p2.x) / (1 + ratio);
    let y = (p1.y + ratio * p2.y) / (1 + ratio);
    return { x, y };
  }

  /**
   * 
   * @returns 
   */
  function getPoints(): Point[][][] {
    const midRadius1 =
      Math.sqrt(radius ** 2 - (0.5 * radius) ** 2) * midRadiusZoom1;
    const midRadius2 =
      Math.sqrt(radius ** 2 - (0.5 * radius) ** 2) * midRadiusZoom2;

    const res = [];
    const pointsArray = [];
    // для каждого сектора
    for (let i = 0; i < 6; i++) {
      let mr1: number, mr2: number;
      if (i % 2 === 0) {
        mr1 = midRadius1;
        mr2 = midRadius2;
      } else {
        mr1 = midRadius2;
        mr2 = midRadius1;
      }
      let m1: Point = { x: center.x, y: center.y - mr1 };
      let p: Point = { x: center.x, y: center.y - radius };
      let m2: Point = { x: center.x, y: center.y - mr2 };
      let deg: number = (i * 360) / 6;

      p = rotate(p, deg + 30);
      m1 = rotate(m1, deg);
      m2 = rotate(m2, deg + 60);

      const countN = 4;

      let segment = [];
      for (let n = 0; n <= countN; n++) {
        let c_m1 =
          n == countN ? m1 : getRatioDividePoint(center, m1, n / (countN - n));
        let m2_p =
          n == countN ? p : getRatioDividePoint(m2, p, n / (countN - n));

        let row = [];
        for (let m = 0; m <= countN; m++) {
          let sr =
            m == countN
              ? m2_p
              : getRatioDividePoint(c_m1, m2_p, m / (countN - m));
          res.push(sr);
          row.push(sr);
        }
        segment.push(row);
      }
      pointsArray.push(segment);
    }

    return pointsArray;
  }

  /**
   * Преобрасует массив точек в массив полигонов
   * @param points - массив с тосками (6 сегментов по 5х5)
   */
  function getPolygons(points: Point[][][]): Polygon[] {
    const polygons: Polygon[] = [];
    let fillIndex = 0;

    for (let s = 0; s < points.length; s++) {
      fillIndex++;
      for (let i = 0; i < points[s].length - 1; i++) {
        fillIndex++;
        for (let j = 0; j < points[s][i].length - 1; j++) {
          fillIndex++;
          let polygonPoints = [
            points[s][i][j],
            points[s][i + 1][j],
            points[s][i + 1][j + 1],
            points[s][i][j + 1],
          ];

          let initialValue: Point = { x: 0, y: 0 };
          let pointsSum = polygonPoints.reduce(
            (sum, point) => ({ x: sum.x + point.x, y: sum.y + point.y }),
            initialValue
          );

          let center: Point = { x: pointsSum.x / 4, y: pointsSum.y / 4 };

          let minRadius = Infinity;

          for (let i = 0; i < polygonPoints.length; i++) {
            const next = i === polygonPoints.length - 1 ? 0 : i + 1;
            const midpoint = getRatioDividePoint(
              polygonPoints[i],
              polygonPoints[next],
              1
            );

            let dist = getDistanse(midpoint, center);
            if (dist < minRadius) minRadius = dist;
          }

          let polygon: Polygon = {
            points: polygonPoints, //: polygonPoints.map((el) => `${el.x},${el.y}`),
            fill: fillIndex % 2 === 0 ? "black" : "none",
            id: "polygon_" + fieldNames[s][i][j],
            center,
            minRadius,
          };

          polygons.push(polygon);
        }
      }
    }
    const minRadius = Math.min(...polygons.map((el) => el.minRadius)) * 0.8;
    setPieceRadius(minRadius);
    return polygons;
  }

  /**
   * Возвращает расстояние между точками
   * @param point1
   * @param point2
   */
  function getDistanse(point1: Point, point2: Point): number {
    return Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2);
  }

  useEffect(() => {
    console.log("Effect hook.");
    let points = getPoints();
    let polygons = getPolygons(points);
    let p = polygons.filter((p) => p.fill === "black");
    console.log(p.map((el) => el.id.split("_")[1]));
    setPoints(points.flat(2));

    setPolygons(polygons);
    console.log({ board });
  }, [center, radius, midRadiusZoom1, midRadiusZoom2, pieceRadius, board]);


  useEffect(() => {
    console.log({ selectedPolygon });
  }, [selectedPolygon])

  // const handlePolygonClick = (e) => {
  //   console.log('click')
  //   const targetId = e.target.id;
  //   const [, field] = targetId.split("_");
  //   try {
  //     const fieldState = boardState.getFieldState(field);
  //     console.log({ fieldState })
  //     if (fieldState & FieldState.PLAYER1)
  //       setSelectedPolygon(field)
  //   } catch (error) {
  //     console.log({ error })
  //   }

  // }

  function getPolygonByFieldName(fieldName: string) {
    return polygons.find((p) => String(p.id).endsWith(fieldName));
  }

  function onBoardSettingsChange(e: BoardSettingsProps) {
    console.log({e})
    if (e.boardRadius) setRadius(e.boardRadius);
    if (e.midRadius1) setMidRadiusZoom1(e.midRadius1);
    if (e.midRadius2) setMidRadiusZoom2(e.midRadius2);
  }

  return (
    <div className="flex size-[600px] ">
      <div className={styles["board-wrapper"]}>
        <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
          {polygons.map((p, index) => (
            <BoardField
              id={p.id}
              fill={p.fill}
              points={p.points.map((el: Point) => `${el.x},${el.y}`)}
              selected={p.id.endsWith(selectedPolygon)}
              key={index}
              // onClick={handlePolygonClick}
            />
          ))}

          {board
            .filter(({ value }) => value !== 0)
            .map((state, index) => {
              const p = getPolygonByFieldName(state.f);
              if (!p) return null;
              // console.log({ index, state, p });
              const classNames = [
                styles.piece,
                state.value & FieldState.PLAYER1 ? styles["piece-p1"] : [],
                state.value & FieldState.PLAYER2 ? styles["piece-p2"] : [],
                state.value & FieldState.PLAYER3 ? styles["piece-p3"] : [],
              ];

              return (
                <circle
                  id={"piece_" + state.f}
                  className={classNames.join(" ")}
                  cx={p.center.x}
                  cy={p.center.y}
                  r={pieceRadius}
                  key={index}
                />
              );
            })}
        </svg>
      </div>

      <BoardSettings boardRadius={radius} midRadius1={midRadiusZoom1} midRadius2={midRadiusZoom2} onChange={onBoardSettingsChange} />
    </div>
  );
}
