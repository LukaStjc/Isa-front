import React, { Component } from 'react';
import EquipmentOrderingService from '../services/EquipmentOrderingService';

import UserService from "../services/user.service";

class EquipmentOrderingComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      equipment: [],
      searchName: '',
      searchScore: 0.0,
      searchType: -1,
      content: ''
    };

    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.handleScoreChange = this.handleScoreChange.bind(this);
  }

  componentDidMount() {
    UserService.getUserBoard().then(
      response => {
      this.setState({
          content: response.data
      });
      },
      error => {
      this.setState({
          content:
          (error.response &&
              error.response.data &&
              error.response.data.message) ||
          error.message ||
          error.toString()
      });

      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      //   EventBus.dispatch("logout");
          this.props.history.push('/profile');
          console.log("Error: Nemate potrebne privilegije za pristup stranici");
      }
      }
  );

    this.fetchEquipment();
  }

  fetchEquipment = () => {
    EquipmentOrderingService.getEquipmentBasic().then((res) => {
      this.setState({ equipment: res.data });
    });
  };

  handleSearch = () => {
    EquipmentOrderingService.searchEquipmentBasic(this.state.searchName, this.state.searchType, this.state.searchScore).
    then((res) => {
      this.setState({ equipment: res.data });
    });
  };

  handleTypeChange=(e) =>{
    const selectedType = e.target.value;
    let numericValue;
  
    switch (selectedType) {
      case 'not_selected':
        numericValue = -1;
        break;
      case 'type1':
        numericValue = 0;
        break;
      case 'type2':
        numericValue = 1;
        break;
      case 'type3':
        numericValue = 2;
        break;
      default:
        numericValue = -1;
    }
    this.setState({ searchType: numericValue });
  
  }

  handleScoreChange=(e) =>{
    const inputValue = e.target.value;
    if(inputValue === ''){
      this.setState({ searchScore: 0.0 });
    }

    const numericValue = parseFloat(inputValue);
    
    if (!isNaN(numericValue)) {
      this.setState({ searchScore: numericValue });
    }
  }

  render() {
    return (
      <>
        <h2 className='text-center'>List of equipment for ordering</h2>

        <div className='search-container'>
          <input
            type='text'
            placeholder='Search name...'
            value={this.state.searchName}
            onChange={(e) => this.setState({ searchName: e.target.value })}
          />

          <input
            type='number'
            placeholder='Search by average score...'
            value={this.state.searchScore}
            onChange={this.handleScoreChange}
            min={0}
            max={999}
          />

          <select
            value={this.state.searchType === -1 ? '' : `type${this.state.searchType + 1}`}
            onChange={this.handleTypeChange}
          >
            <option value='' disabled>Select Equipment Type</option>
            <option value='not_selected'>No type</option>
            <option value='type1'>Type 1</option>
            <option value='type2'>Type 2</option>
            <option value='type3'>Type 3</option>
          </select>

          <button onClick={this.handleSearch} style={{ display: 'inline-block' }}>
            Search
          </button>
        </div>


        <div className='row'>
          <table className='table table-striped table-bordered'>
            <thead>
              <tr>
                <th>Equipment name</th>
                <th>Equipment description</th>
                <th>Equipment type</th>
                <th>Available at company</th>
                <th>Company score</th>
              </tr>
            </thead>
            <tbody>
              {this.state.equipment.map((equipment) => (
                <tr key={equipment.id}>
                  <td>{equipment.name}</td>
                  <td>{equipment.description}</td>
                  <td>{equipment.equipmentType}</td>
                  <td>{equipment.companyName}</td>
                  <td>{equipment.averageScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  }
}

export default EquipmentOrderingComponent;
