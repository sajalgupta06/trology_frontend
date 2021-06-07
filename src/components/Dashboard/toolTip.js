import React, { useState } from "react";
import { Tooltip } from "reactstrap";

export const TooltipItem = props => {
    const { position = 'bottom-start', id } = props;
    const [tooltipOpen, setTooltipOpen] = useState(false);

    const toggle = () => setTooltipOpen(!tooltipOpen);

    return (
        <span>
            <h4 class={props.elpsisClassName} id={"tooltip-" + id}>
                {props.title}
            </h4>
            <Tooltip
                placement={position}
                isOpen={tooltipOpen}
                target={"tooltip-" + id}
                toggle={toggle}
            >
                {props.title}
            </Tooltip>
        </span>
    );
};


export default TooltipItem;
