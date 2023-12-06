import React, { Component } from 'react';



class ReplyToComplaint extends Component {
    constructor(props) {
        super(props);

        this.state={
            reply: ''
        }

        this.changeReplyHandler = this.changeReplyHandler.bind(this);
    }

    changeReplyHandler=(e) =>{
        this.setState({reply: e.target.value});
    }    

    render() {
        return (
            <div className='text-center'>
                <h2>Write your reply</h2>
                <form>
                    <textarea placeholder='Write your reply' className='form-control' value={this.state.reply} 
                        onChange={this.changeReplyHandler} style={{marginTop: '90px', fontSize: 22, overflowY: "auto"}}/>
                </form>
            </div>
        );
    }
}

ReplyToComplaint.propTypes = {

};

export default ReplyToComplaint;