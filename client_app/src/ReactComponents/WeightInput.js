import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import Slider from 'material-ui/Slider';

import Paper from 'material-ui/Paper';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const styles = {
  margins:{
    'marginTop':'10px',
    'marginBottom':'10px'
  },
  customWidth: {
    width: '100%',
  },
};



class WeightInput extends React.Component{

  constructor(props) {
    super(props);

    this.state = {
      value: this.props.value,
    };

     this.handleSlider=(event, value) => {
    this.setState({value: value});
  };

  }

render(){
return (
  <MuiThemeProvider>
  <div style = {{'marginTop':10,'marginRight':20, 'marginLeft':20}}>
          <span className='label'>{this.props.id + ': '}</span>
          <span className='label'>{this.state.value}</span>
        
  <Slider min={0}
          max={10} 
          step={1}
          defaultValue={this.state.value}
          onChange={this.handleSlider}
         sliderStyle = {{'marginTop':5, 'marginBottom':10}}/>

         

  </div>
   </MuiThemeProvider>)

  
}

}

export default WeightInput;