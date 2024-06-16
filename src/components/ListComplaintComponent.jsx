import React, { Component } from 'react';

import ComplaintService from '../services/ComplaintService';
import UserService from '../services/user.service';


class ListComplaintComponent extends Component {
    constructor(props) {
        super(props)

        this.state={
            complaints: [],
            content: ''
        }

    }

    componentDidMount(){
        UserService.getSystemAdminBoard().then(
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

        ComplaintService.getAll().then((res) => {
            this.setState({complaints: res.data});
        });
    }

    replyToComplaint(id){
        this.props.history.push(`/api/complaints/reply/${id}`);
    }

    render() {
        return (
            <>
                <h2 className='text-center'>List of all complaints</h2>
                <div className='row'>
                    <table className='table table-striped table bordered'>
                        <thead>
                            <tr>
                                <th>Comment</th>
                                <th>Written by</th>
                                <th>For company</th>
                                <th>For company administrator</th>
                            </tr>
                        </thead>

                        <tbody>
                            {this.state.complaints.map((c) => (
                                <tr key={c.id}>
                                    <td>{c.comment}</td>
                                    <td>{c.writerName}</td>
                                    <td>{c.companyName}</td>
                                    <td>{c.companyAdminName}</td>
                                    <td>
                                        <button onClick={() => this.replyToComplaint(c.id)} className='bnt btn-info'>Reply</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </>
        );
    }
}

ListComplaintComponent.propTypes = {

};

export default ListComplaintComponent;