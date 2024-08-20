import React, { Component } from 'react';
import CompanyService from '../services/CompanyService';

class ListCompaniesComponent extends Component {

    constructor(props){
        super(props)

        this.state = {
            companies: [],
            searchText: '',
            user: JSON.parse(localStorage.getItem('user')) || {},
        }
        this.showCompany = this.showCompany.bind(this);

    }
    showCompany(id){
        this.props.history.push(`/api/companies/${id}`);
    }
    updateCompany(id){
      this.props.history.push(`/api/companies/update/${id}`);      
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
        const { user } = this.state;

        return (
          <div>
            <h2 style={{padding: '20px'}} className='text-center'>Companies List</h2>
  
                <div className='search-container'>
                <input
                    type='text'
                    placeholder='Search...'
                    value={this.state.searchText}
                    onChange={(e) => this.setState({ searchText: e.target.value })}
                />
                <button className='btn btn-primary mr-1-sm' onClick={this.handleSearch}>Search</button>
                </div>
            <div className='row'>
              <table className='table table-striped table-bordered'>
                <thead>
                  <tr>
                    <th>Company name</th>
                    <th>Company description</th>
                    <th>Average score</th>
                    <th>Details</th>
                    { user && user.roles && user.roles.includes('ROLE_COMPANY_ADMIN') &&
                    <th>Update</th>
                    }
                      
                  </tr>
                </thead>
                <tbody>
                  {this.state.companies.map((company) => (
                    <tr key={company.id}>
                      <td>{company.name}</td>
                      <td>{company.description}</td>
                      <td>{company.averageScore}</td>
                      <td>
                        <button onClick={() => this.showCompany(company.id)} class="btn btn-secondary">Show</button>
                        </td>
                        { user && user.roles && user.roles.includes('ROLE_COMPANY_ADMIN') &&
                        <td>
                        <button onClick={() => this.updateCompany(company.id)} class="btn btn-dark">Update</button>

                        </td>
                        }

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