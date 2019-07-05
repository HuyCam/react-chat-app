import React from 'react';

class Contact extends React.Component {
    handleClick = () => {

        this.props.handleUpdateCon(this.props.conversation._id);
    }

    render() {
        const { receiver, lastDialog } = this.props;
        let content;
        let shortenedContent = lastDialog.content;

        // shorten dialog if it too long
        if (shortenedContent.length > 30) {
            shortenedContent = lastDialog.content.substring(0, 30) + '...';
        }
        if (receiver._id === lastDialog.senderID ) {
            content = `${shortenedContent}`;
        } else {
            content = `You: ${shortenedContent}`;
        }
        return <div onClick={this.handleClick} className={"contact " + (this.props.isSelected ? 'selected' : '')}>
            <div className="avatar-holder">
                <img src={`http://localhost:3001/users/${this.props.receiver._id}/avatar`} alt="avatar" className="contact-avatar" />
            </div>
            
            <div className="contact-detail">
                <h3>{this.props.receiver.name}</h3>
                <p className="last-dialog">{content}</p>
            </div>
        </div>
    }
}

export default Contact;