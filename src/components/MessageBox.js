import React, { useEffect, useState } from 'react';

const MessageBox = () => {
    const [ messagePopup , setMessagePopup ] = useState(false);
    const [ messages, setMessages ] = useState([{type: 1, content: "Hello! How can we help you?"}]); //0: client, 1: server

    const addClientMessage = (new_message) => {
        const new_messages = [...messages, {
            content: new_message,
            type: 0,
        }];
        setMessages(new_messages);
    }

    useEffect(() => {
        document.getElementsByClassName('dummy')[0].scrollTop = 99999999;
    }, [messages]);
    
    return (
        <div className="message-box">
            <div className='message-title'>
                Time2Movie<i class={messagePopup ? "fa fa-angle-down" : "fa fa-angle-up"} 
                onClick={() => setMessagePopup(!messagePopup)}></i>
            </div>
            <div className='message-content'
                style={{
                    display: messagePopup ? "block" : "none"
                }}>
                <div className='messages'>
                    <div className='dummy'>
                        {messages.map(message => (
                            <div className={`message ${message.type === 0 ? 'client' : 'server'}`}> 
                                {message.content}
                            </div>
                        ))}
                    </div>
                    
                </div>
                <div className='input'>
                    <textarea id='input-text' placeholder='Aa' onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            addClientMessage(e.target.value);
                            e.target.value = '';                        console.log(e.key);
                            e.target.focus();
                            e.target.setSelectionRange(0, 0);
                        }
                        console.log(messages);
                    }}/>
                    <button className='submit-message'>
                        Send
                    </button>
                </div>
            </div>
        </div>
    )
}

export default MessageBox;