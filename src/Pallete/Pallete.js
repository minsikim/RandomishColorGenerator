import React, { Component } from 'react';
import './Pallete.css';

const d3 = require('d3-color');

const pallete = (props) => {
    const colorDiv = props.colors.map((obj, idx)=>{
        return (
        <div className="ColorCircle" key={idx} style={{backgroundColor: obj}}>
            <p>
                {props.showText ? "hcl("+obj.h+", "+obj.c+", "+obj.l+")" : ""}<br></br>
                {props.showText ? obj+"" : ""}
            </p>
        </div>
        )
    })


    return (
        <div className="Pallete">
            {colorDiv}
        </div>
    );
}
 
export default pallete;