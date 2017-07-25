import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const styles = {
  customWidth: {
    width: 150,
  }
};

class WeightSelector extends React.Component {

  state = {value: 1};
  
  handleChange (event, index, value) {this.setState({value})};

  render() {
    return (
      <div>
        <SelectField
          floatingLabelText={this.props.value}
          value={this.state.value}
          onChange={this.handleChange}
        >
          <MenuItem value={1} primaryText='Today' />
          <MenuItem value={2} primaryText="Every Night" />
          <MenuItem value={3} primaryText="Weeknights" />
          <MenuItem value={4} primaryText="Weekends" />
          <MenuItem value={5} primaryText="Weekly" />
        </SelectField>
      </div>
    );
  }
}

export default WeightSelector; 