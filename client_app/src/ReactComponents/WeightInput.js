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



class SideBarComponent extends React.Component{

  constructor(props) {
    super(props);

    this.state = {
      value:1
    };
  }

render(){
return (
  <MuiThemeProvider>
  <div>

  <Slider min={0}
          max={10} 
          defaultValue={this.props.value}
         style={{ margin: 0 }}/>

  </div>
   </MuiThemeProvider>)

  
}

}

export default SideBarComponent;