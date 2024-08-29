import React, { Component } from 'react';
import EquipmentService from '../services/EquipmentService';

class ListCompanyEquipments extends Component {
  constructor(props) {
    super(props);

    this.state = {
      equipments: []
    };
  }

  componentDidMount() {
    const companyId = this.props.match.params.id;
    EquipmentService.getCompanyEquipment(companyId).then((res) => {
      this.setState({ equipments: res.data });
    });
  }

  render() {
    return (
      <div>
        <h2 className='text-center'>Equipments List of Company</h2>
        <div className='row'>
          <table className='table table-striped table-bordered'>
            <thead>
              <tr>
                <th>Equipment name</th>
                <th>Equipment description</th>
                <th>Equipment type</th>
                <th>Price</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {this.state.equipments.map((equipment) => (
                <tr key={equipment.id}>
                  <td>{equipment.name}</td>
                  <td>{equipment.description}</td>
                  <td>{equipment.equipmentType}</td>
                  <td>{equipment.price}</td>
                  <td>{equipment.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default ListCompanyEquipments;
