import styles from "./styles.module.css";

interface BoardFieldProps {
    id?: string,
    fill?: string,
    selected?: boolean,
    points?: string,
    onClick?: (value: any) => void
}
export default function BoardField(props: BoardFieldProps) {
    // const handleMouseEnter = (e) => {
    //     const targetId = e.target.id;
    //     const [, field] = targetId.split("_");

    //     const piece = document.getElementById("piece_" + field);
    //     if (!piece) return;

    //     piece.classList.toggle(styles["piece--active"], true);

    // };

    const handleMouseLeave = (e: { target: { fill: string; }; }) => {
        e.target.fill = "maroon";
    };

    return (
        <polygon
            id={props.id}
            className={[
                styles.polygon,
                props.fill === "black"
                    ? styles["polygon-black"]
                    : styles["polygon-white"],
                props.selected ? styles["polygon--selected"] : []
            ].join(" ")}
            points={props.points}
            stroke="black"
            // onMouseEnter={handleMouseEnter}
            // onMouseLeave={handleMouseLeave}
            onClick={props.onClick}
        />
    )
}