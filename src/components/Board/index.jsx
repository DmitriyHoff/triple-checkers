import { useEffect, useState } from "react";
import Slider from "rsuite/Slider";
import "rsuite/Slider/styles/index.css";
import styles from "./styles.module.css";

export default function Board() {
  let [center, setCenter] = useState({ x: 200, y: 200 });
  let [radius, setRadius] = useState(180);
  let [midRadiusZoom, setMidRadiusZoom] = useState(1);
  let [points, setPoints] = useState([]);
  let [polygons, setPolygons] = useState([]);
  let [pieceRadius, setPieceRadius] = useState(10)

  function fromPoint(point) {
    return { left: point.x + "px", top: point.y + "px" };
  }

  /**
   * Поворачивает точку относительно центра
   * @param {*} p Точка для поворото
   * @param {*} deg Угол в градусах
   * @returns
   */
  function rotate(p, deg) {
    let cos = Math.cos((Math.PI / 180) * deg);
    let sin = Math.sin((Math.PI / -180) * deg);
    let x = (p.x - center.x) * cos + (p.y - center.y) * sin + center.x;
    let y = (p.y - center.y) * cos - (p.x - center.x) * sin + center.y;
    return { x, y };
  }

  /**
   * Возвращает координаты точки, разделяющей отрезок в указанном соотношении
   * @param {*} p1
   * @param {*} p2
   * @param {*} ratio
   */
  function getRatioDividePoint(p1, p2, ratio) {
    let x = (p1.x + ratio * p2.x) / (1 + ratio);
    let y = (p1.y + ratio * p2.y) / (1 + ratio);
    return { x, y };
  }

  function getPoints() {
    let midRadius =
      Math.sqrt(radius ** 2 - (0.5 * radius) ** 2) * midRadiusZoom;

    const res = [];
    let pointsArray = [];
    // для каждого сектора
    for (let i = 0; i < 6; i++) {
      let m1 = { x: center.x, y: center.y - midRadius };
      let p = { x: center.x, y: center.y - radius };
      let m2 = Object.assign({}, m1);
      let deg = (i * 360) / 6;

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

  function getPolygons(points) {
    const polygons = [];
    let fillIndex = 0;
    let id = 0;
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

          let initialValue = {x: 0, y: 0}
          let pointsSum = polygonPoints.reduce(
            (sum, point) => ({ x: sum.x + point.x, y: sum.y + point.y}),
            initialValue);

          let center = {x: pointsSum.x/4, y: pointsSum.y/4}

          let minRadius = Infinity;

          for (let i = 0; i < polygonPoints.length; i++) {
            const next = i === polygonPoints.length - 1 ? 0 : i + 1;
            const midpoint = getRatioDividePoint(polygonPoints[i], polygonPoints[next], 1)
            
            let dist = getDistanse(midpoint, center)
            if(dist < minRadius) minRadius = dist;

          }
          let polygon = {
            points: polygonPoints.map((el) => `${el.x},${el.y}`),
            fill: fillIndex % 2 === 0 ? "black" : "none",
            id: "polygon_" + id++,
            center,
            minRadius
          };
          //console.log(polygon)
          polygons.push(polygon);
        }
      }
    }
    const minRadius = Math.min(...(polygons.map(el => el.minRadius))) * 0.8
    setPieceRadius(minRadius);
    return polygons;
  }

  /**
   * Возвращает расстояние между точками
   * @param {*} point1 
   * @param {*} point2 
   * @returns 
   */
  function getDistanse(point1, point2) {
    return Math.sqrt((point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2);
  }
  useEffect(() => {
    console.log("Effect hook.");
    let points = getPoints();
    let polygons = getPolygons(points);
    setPoints(points.flat(2));

    setPolygons(polygons);
  }, [center, radius, midRadiusZoom, pieceRadius]);

  const handleMouseEnter = (e) => {
    e.target.fill = "grey";
    console.log(e.target.fill);
    console.log("mouseEnter");
  };
  const handleMouseLeave = (e) => {
    e.target.fill = "maroon";
  };
  return (
    <>
      <div className={styles["board-wrapper"]}>

        <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
          {polygons.map((p) => (
            <polygon
              id={p.id}
              className={[
                styles.polygon,
                p.fill === "black"
                  ? styles["polygon-black"]
                  : styles["polygon-white"],
              ].join(" ")}
              points={p.points}
              key={polygons.indexOf(p)}
              stroke="black"
              // fill={p.fill}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
          ))}
          {polygons.filter((p)=> p.fill === 'black').map ((p) => (
            <circle className={styles.piece} cx={p.center.x} cy={p.center.y} r={pieceRadius} key={polygons.indexOf(p)} />
          ))}
        </svg>
      </div>

      <Slider
        progress
        style={{ marginTop: 16 }}
        min={100}
        max={190}
        value={radius}
        onChange={(value) => setRadius(value)}
      />
      <Slider
        progress
        style={{ marginTop: 16 }}
        min={0.8}
        max={1.1}
        step={0.01}
        value={midRadiusZoom}
        onChange={(value) => setMidRadiusZoom(value)}
      />
    </>
  );
}
