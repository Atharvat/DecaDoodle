import "../App.js";
import React from 'react';

function CarouselItem(props) {
    return (
        <div className={props.selected?"current_selected":props.type==="generation"? "carousel_item":"add_item"} onClick={() =>props.clicked(props.type, props.id)}>
            <img className={props.type==="generation"?"carousel_img":"add_img"} src={props.imgSrc} alt="carousel item"/>
        </div>
    );
}

export default CarouselItem;