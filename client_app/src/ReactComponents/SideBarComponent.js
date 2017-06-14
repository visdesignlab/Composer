import React from 'react';
import Paper from 'material-ui/Paper';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import AppBar from 'material-ui/AppBar';

import WeightInput from './WeightInput'

import * as ajax from 'phovea_core/src/ajax';
import {select, selectAll, event} from 'd3-selection';
import {values,keys,entries} from 'd3-collection';
import {type} from 'os';
//import {transition} from 'd3-transition';
import {Constants} from '../constants';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

const style = {
  height: 760,
  width: '100%',
  display: 'inline-block',
};

class SideBarComponent extends React.Component{

  constructor(props) {
    super(props);

    this.state = {
      args_Demo:null,
      args_CCI:null,
      weights:null,
      inputs:entries(Constants.sideBar.Demo).concat(entries(Constants.sideBar.CCI))
    };
  }

  componentDidMount() {

        ajax.getAPIJSON(`/data_api/getWeights/Demo`).then(
          (args_Demo)=>{this.setState({args_Demo:args_Demo}); ajax.getAPIJSON(`/data_api/getWeights/CCI`).then(
            (args_CCI)=>{this.setState({args_CCI:args_CCI,
              weights:Object.assign(this.state.args_Demo.weights,args_CCI.weights)

            }); 
          
            console.log(this.state)}
            )}
          )
  
  }

render(){
return (
  <MuiThemeProvider>
  <div>
    <Paper style={style} zDepth={2} >

    <AppBar
    showMenuIconButton={false} title="Weight Panel" titleStyle={{'color':'rgba(0,0,0,0.4)','font-size':'16px','text-align':'center'}} style={{'background-color':'rgb(232, 232, 232)'}}
  />

       {this.state.weights && 
        this.state.inputs.map((d, i) => {return (
        <WeightInput key={d.key} id={d.value} value={this.state.weights[d.key]}/>
          )})}
      
        
    </Paper>
  </div>
   </MuiThemeProvider>)

  
}

}

export default SideBarComponent;