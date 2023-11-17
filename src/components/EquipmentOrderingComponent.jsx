import React, { Component } from 'react';
import EquipmentOrderingService from '../services/EquipmentOrderingService';

class EquipmentOrderingComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      equipment: [],
      searchText: '',
    };
  }

  componentDidMount() {
    this.fetchEquipment();
  }

  fetchEquipment = () => {
    EquipmentOrderingService.getEquipmentBasic().then((res) => {
      this.setState({ equipment: res.data });
    });
  };

  handleSearch = () => {
    const { searchText } = this.state;

    EquipmentOrderingService.searchEquipmentBasic(searchText).then((res) => {
      this.setState({ equipment: res.data });
    });
  };

  render() {
    return (
      <>
        <h2 className='text-center'>List of equipment</h2>

        <div className='search-container'>
          <input
            type='text'
            placeholder='Search...'
            value={this.state.searchText}
            onChange={(e) => this.setState({ searchText: e.target.value })}
          />
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
                <th>Company name</th>
                <th>Company score</th>
              </tr>
            </thead>
            <tbody>
              {this.state.equipment.map((equipment) => (
                <tr key={equipment.id}>
                  <td>{equipment.name}</td>
                  <td>{equipment.description}</td>
                  <td>{equipment.equipmentType}</td>
                  <td>{equipment.company.name}</td>
                  <td>{equipment.company.averageScore}</td>
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
