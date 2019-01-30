import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';

import Pallete from "./Pallete/Pallete";
import {RandomInt, d3} from './Methods/ColorMethods';

const style = { width: "100%", margin: 20 };
const DEFAULT_HUE = [0,360];
const DEFAULT_CHROMA = [0,100];
const DEFAULT_LIGHTNESS = [0,100];


class App extends Component {
  state = {
    h: DEFAULT_HUE,
    c: DEFAULT_CHROMA,
    l: DEFAULT_LIGHTNESS,
    colorQuantity: 12,
    normalizeValue: 10,
    colorGenerated: [],
    generateOnChange: true,
    viewRGBtext: true,
    normalizeHue: true
  }
  changeHue = (val)=>{
    if(val && this.state.h !== val) this.setState({h: val})
    if(this.state.generateOnChange) this.generateColor();
  }
  changeChroma = (val)=>{
    if(val && this.state.c !== val) this.setState({c: val})
    if(this.state.generateOnChange) this.generateColor();
  }
  changeLightness = (val)=>{
    if(val && this.state.l !== val) this.setState({l: val})
    if(this.state.generateOnChange) this.generateColor();
  }
  changeQuantity = (val)=>{
    if(val && this.state.colorQuantity !== val) this.setState({colorQuantity: val})
    if(this.state.generateOnChange) this.generateColor();
  }
  changeNormalizeValue = (val)=>{
    if(val && this.state.normalizeValue !== val) this.setState({normalizeValue: val})
    if(this.state.generateOnChange) this.generateColor();
  }
  checkboxHandler = (e)=>{
    this.setState({ [e.target.id]: e.target.checked });
    // if(e.target.id === "generateOnChange") this.generateColor();
  }
  generateColor = ()=>{
    // console.log(this.state.h)
    let tempColors = [];
    //[0, 100] 인 어레이가 있으면 그 사이값중 랜덤 정수
    let tempRandomValues = (hcl)=> RandomInt(hcl[1]-hcl[0])+hcl[0];
    for(var i = 0; i < this.state.colorQuantity; i++){
      let tempH;
      let tempC = tempRandomValues(this.state.c);
      let tempL = tempRandomValues(this.state.l);
      if(this.state.normalizeHue === true){
        //기본 구간의 크기를 구하고(예: 360중 12개일때 30)
        var section = Math.floor((this.state.h[1]-this.state.h[0])/this.state.colorQuantity);
        //Range에 section + 겹침구간*2(예: 30에서 양쪽으로 10씩 더해서 50)
        var randomRange = section + this.state.normalizeValue*2;
        tempH = tempRandomValues([0, randomRange])+section*i-Math.floor(section/2);
        if(tempH < 0){
          tempH += 360;
        }else if(tempH > 360){
          tempH -= 360;
        }
      }else{
        tempH = tempRandomValues(this.state.h);
      }
      console.log(tempH, tempC, tempL,d3.hcl(tempH, tempC, tempL))
      tempColors.push(d3.hcl(tempH, tempC, tempL));
    }
    this.setState({colorGenerated: tempColors})
  }

  componentDidMount(){
    this.generateColor();
    document.getElementById('generateOnChange').checked = this.state.generateOnChange;
    document.getElementById('viewRGBtext').checked = this.state.viewRGBtext;
    document.getElementById('normalizeHue').checked = this.state.normalizeHue;
  }

  render() {
    return (
      <div className="App">
        <div className="ToolWrapper">
          <h1>RGB-it <span>Color Range Experiment</span></h1>
          <Pallete colors={this.state.colorGenerated} showText={this.state.viewRGBtext}/>
          <div className="RangeWrapper">
            <div className="OptionWrapper">
              <div className="Option">
                <label>Generate on Change</label> 
                <input id="generateOnChange" type="checkbox" onChange={this.checkboxHandler}/>
              </div>
              <div className="Option">
                <label>View Color Value</label> 
                <input id="viewRGBtext" type="checkbox" onChange={this.checkboxHandler}/>
              </div>
              <div className="Option">
                <label>Normalize Random Hue</label> 
                <input id="normalizeHue" type="checkbox" onChange={this.checkboxHandler}/>
              </div>
              <button onClick={this.generateColor}>Generate</button>
            </div>
            <div className="CustomRanges">
              <p>Hue : {this.state.h[0]+" - "+this.state.h[1]}</p>
              <Range id="Hue" min={0} max={360} defaultValue={[0, 360]} tipFormatter={value => `${value}%`} 
                  onChange={this.changeHue}
                  marks={{0:"0", 360:"360"}}/>
            </div>
            <div className="CustomRanges">
              <p>Chroma : {this.state.c[0]+" - "+this.state.c[1]}</p>
              <Range id="Chroma" min={0} max={100} defaultValue={[20, 80]} tipFormatter={value => `${value}%`} 
                  onChange={this.changeChroma}
                  marks={{0:"0", 10:"10", 20:"20", 30:"30", 40:"40", 50:"50", 60:"60", 70:"70", 80:"80", 90:"90", 100:"100"}}/>
            </div>
            <div className="CustomRanges">
              <p>Lightness : {this.state.l[0]+" - "+this.state.l[1]}</p>
              <Range id="Saturation" min={0} max={100} defaultValue={[20, 80]} tipFormatter={value => `${value}%`} 
                  onChange={this.changeLightness}
                  marks={{0:"0", 10:"10", 20:"20", 30:"30", 40:"40", 50:"50", 60:"60", 70:"70", 80:"80", 90:"90", 100:"100"}}/>
            </div>
            <div className="CustomRanges">
              <p>Normalization Overlap Value : {this.state.normalizeValue}</p>
              <Slider id="normalizeValue" min={0} max={30} defaultValue={10} tipFormatter={value => `${value}%`} 
                  onChange={this.changeNormalizeValue}
                  marks={{0:"0", 10:"10", 20:"20", 30:"30"}}/>
            </div>
            <div className="CustomRanges">
              <p>Quantity : {this.state.colorQuantity}</p>
              <Slider id="Quantity" min={0} max={30} defaultValue={12} tipFormatter={value => `${value}%`} 
                  onChange={this.changeQuantity}
                  marks={{0:"0", 10:"10", 20:"20", 30:"30"}}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
