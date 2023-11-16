import React, { Component } from 'react';
import EquipmentService from '../services/EquipmentService';

class ListEquipmentComponent extends Component {
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
    EquipmentService.getEquipment().then((res) => {
      this.setState({ equipment: res.data });
    });
  };

  handleSearch = () => {
    const { searchText } = this.state;

    EquipmentService.searchEquipment(searchText).then((res) => {
      this.setState({ equipment: res.data });
    });
  };

  render() {
    return (
      <div>
        <h2 className='text-center'>Equipment List</h2>

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
                <th>Price</th>
                <th>Quantity</th>
                <th>Company name</th>
              </tr>
            </thead>
            <tbody>
              {this.state.equipment.map((equipment) => (
                <tr key={equipment.id}>
                  <td>{equipment.name}</td>
                  <td>{equipment.description}</td>
                  <td>{equipment.equipmentType}</td>
                  <td>{equipment.price}</td>
                  <td>{equipment.quantity}</td>
                  <td>{equipment.companyName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default ListEquipmentComponent;
