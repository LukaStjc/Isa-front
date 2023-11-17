import React, { Component } from 'react';
import CompanyService from '../services/CompanyService';

class ListCompaniesComponent extends Component {

    constructor(props){
        super(props)

        this.state = {
            companies: [],
            searchText: '' //
        }
        this.showCompany = this.showCompany.bind(this);
    }
    showCompany(id){
        this.props.history.push('/${id}');
    }


    componentDidMount() { //
        this.fetchCompanies();
      }

    
    fetchCompanies = () => { //
        CompanyService.getCompanies().then((res) => {
          this.setState({ companies: res.data });
        });
    };

    handleSearch = () => {
        const { searchText } = this.state;

        CompanyService.searchCompanies(searchText).then((res) => {
        this.setState({ companies: res.data });
        });
    };

    render() {
        return (
          <div>
            <h2 className='text-center'>Companies List</h2>
    
                <div className='search-container'>
                  <input
                      type='text'
                      placeholder='Search...'
                      value={this.state.searchText}
                      onChange={(e) => this.setState({ searchText: e.target.value })}
                  />
                  <button onClick={this.handleSearch}>Search</button>
                </div>

                <div className='row'>
                  <table className='table table-striped table-bordered'>
                  </table>
                </div>
            
            <div className='row'>
              <table className='table table-striped table-bordered'>
                <thead>
                  <tr>
                    <th>Company name</th>
                    <th>Company description</th>
                    <th>Average score</th>
                    <th>Details</th>

                  </tr>
                </thead>
                <tbody>
                  {this.state.companies.map((company) => (
                    <tr key={company.id}>
                      <td>{company.name}</td>
                      <td>{company.description}</td>
                      <td>{company.averageScore}</td>
                      <button onClick={() => this.showCompany(company.id)} className='btn-btn-info'>Show</button>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      }
}

export default ListCompaniesComponent