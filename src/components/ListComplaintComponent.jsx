import React, { Component } from 'react';

import ComplaintService from '../services/ComplaintService';
import { Redirect } from 'react-router-dom';

class ListComplaintComponent extends Component {
    constructor(props) {
        super(props)

        this.state={
            complaints: [],
            user: JSON.parse(localStorage.getItem('user')) || {},
        }

    }

    componentDidMount(){
        ComplaintService.getAll().then((res) => {
            this.setState({complaints: res.data});
        });
    }

    replyToComplaint(id){
        this.props.history.push(`/api/complaints/reply/${id}`);
    }

    render() {
        const { user } = this.state; 

        if ((user && user.roles && (user.roles.includes('ROLE_SYSTEM_ADMIN'))))
        {
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
        else
        {
            return <Redirect to="/api/companies" />;
        }
        
    }
}

ListComplaintComponent.propTypes = {

};

export default ListComplaintComponent;