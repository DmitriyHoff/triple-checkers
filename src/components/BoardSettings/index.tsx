import { useState, FC } from "react";
import Slider from "@mui/material/Slider"

export interface BoardSettingsProps {
    boardRadius?: number,
    midRadius1?: number,
    midRadius2?: number,
    onChange?: (value: BoardSettingsProps) => void,
}

export default function BoardSettings(props: BoardSettingsProps) {
    const {boardRadius, midRadius1, midRadius2, onChange} = props;
    
    return (
        <div className="flex flex-col p-2 min-w-[200px]">
            <div className="flex gap-2">
                <div>Size: </div>
                <Slider
                size="small"
                min={100}
                max={190}
                step={1}
                value={boardRadius}
                onChange={(_event, value) => onChange({boardRadius: value as number})}
            />
            </div>
            
            <div className="flex gap-2">
                <div className="text-nowrap">Height: </div>
                <Slider
                size="small"
                min={0.8}
                max={1.1}
                step={0.01}
                value={midRadius1}
                onChange={(_event, value) => onChange({midRadius1: value as number})}
            />
            </div>
            
            <div className="flex gap-2">
                <div className="text-nowrap col-span-2">Width: </div>
                <Slider
                    size="small"
                    min={0.8}
                    max={1.1}
                    step={0.01}
                    value={midRadius2}
                    onChange={(_event, value) => onChange({midRadius2: value as number})}
                />
                </div>
        </div>
    )
}