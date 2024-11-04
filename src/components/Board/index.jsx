import { useEffect, useState } from "react";
import Slider from 'rsuite/Slider';
import 'rsuite/Slider/styles/index.css';
import styles from "./styles.module.css";

export default function Board() {
  let [center, setCenter] = useState({ x: 200, y: 200 });
  let [radius, setRadius] = useState(180);
  let [midRadiusZoom, setMidRadiusZoom] = useState(1);
  let [points, setPoints] = useState([]);
  // let [midpoints, setMidpoints] = useState([]);

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
    let midRadius = Math.sqrt(radius ** 2 - (0.5 * radius) ** 2) * midRadiusZoom;
    
    const res = [];

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
  
      for (let n = 0; n <= countN; n++) {
        let c_m1 = n == countN ? m1 : getRatioDividePoint(center, m1, n / (countN - n));
        let m2_p = n == countN ? p : getRatioDividePoint(m2, p, n / (countN - n));

        for (let m = 0; m <= countN; m++) {
           let sr = m == countN ? m2_p : getRatioDividePoint(c_m1, m2_p, m / (countN - m));
           res.push(sr);
        }
      }
      //res.push(...lineX)
      //console.log({res})
      // res.push(m1, p, m2);
    }
    console.log({ res });
    return res;
  }

  useEffect(() => {
    console.log("Effect hook.");
    setPoints(getPoints());
  }, [center, radius, midRadiusZoom]);

  return (
    <>
      <div className={styles["board-wrapper"]}>
        {/* <div className={styles.point} style={{ ...fromPoint(center) }}></div> */}
        {points.map((p) => (
          <div
            className={styles.point}
            style={{ ...fromPoint(p) }}
            key={points.indexOf(p)}
          />
        ))}
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
          step={0.02}
          value={midRadiusZoom}
          onChange={(value) => setMidRadiusZoom(value)}
        />
    </>
  );
}
