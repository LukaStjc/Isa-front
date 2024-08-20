import React, { Component } from 'react';

import ComplaintService from '../services/ComplaintService';
import { Redirect } from 'react-router-dom';

class ReplyToComplaint extends Component {
    constructor(props) {
        super(props);

        this.state={
            reply: '',
            complaintId: props.match.params.id,
            user: JSON.parse(localStorage.getItem('user')) || {},
        }

        this.changeReplyHandler = this.changeReplyHandler.bind(this);
        this.finishReply = this.finishReply.bind(this);
    }

    changeReplyHandler=(e) =>{
        this.setState({reply: e.target.value});
    }

    finishReply=(e) =>{
        e.preventDefault();

        if(this.state.reply === ""){
            console.log("You can't enter an empty reply");
            return;
        }
        if(this.state.reply.length > 255){
            console.log("Your reply is too long :(");
            return;
        }
        
        ComplaintService.saveReply(this.state.reply, this.state.complaintId);
    }

    render() {
        const { user } = this.state; 

        if ((user && user.roles && (user.roles.includes('ROLE_SYSTEM_ADMIN'))))
        {
	        return (
                <div className='text-center'>
                    <h2>Write your reply</h2>
                    <form>
                        <textarea placeholder='Write your reply' className='form-control' value={this.state.reply} 
                            onChange={this.changeReplyHandler} style={{marginTop: '90px', fontSize: 22, overflowY: "auto"}}/>
    
                        <button className='btn btn-success' onClick={this.finishReply} style={{marginTop: '20px'}}>Finish</button>
                    </form>
                </div>
            );
        }
        else
        {
            return <Redirect to="/api/companies" />;
        }
    }
}
export default ReplyToComplaint;