import React, { useEffect, useState } from 'react';
import BASE_URL from '../BaseUrl';

const MessageBox = () => {
    const [ messagePopup , setMessagePopup ] = useState(false);
    const [ messages, setMessages ] = useState([{type: 1, content: "Hello! How can we help you?"}]); //0: client, 1: server

    const addClientMessage = (new_message) => {
        if (new_message.length > 0) {
            setMessages([...messages, {type: 0, content: new_message}]);
        }
    }

    const addBotMessage = (new_message) => {
        if (new_message.length > 0) {
            setMessages([...messages, {type: 1, content: new_message}]);
        }
    }

    const getBotReply = async (message) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                message: message,
                user_id: JSON.parse(window.localStorage.getItem('currentUser'))._id,
            })
        };
        const response = await fetch(`${BASE_URL}/api/movie/bot-reply`, requestOptions);
        const result = await response.json();
        addBotMessage(result.message);
    }

    useEffect(() => {
        const script = document.createElement('script');

        script.src = "https://apps.elfsight.com/p/platform.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
          document.body.removeChild(script);
        }
    }, []);

    useEffect(() => {
        document.getElementsByClassName('dummy')[0].scrollTop = 99999999;
        if (messages.at(-1).type === 0) {
            getBotReply(messages.at(-1).content);
        }
    }, [messages]);

    return (
        <div className="message-box">

            <script src="https://apps.elfsight.com/p/platform.js" defer></script>
            <div class="elfsight-app-05bc3da4-6fd8-406c-b8db-5b6f627ecd8b"></div>
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
                                {message.type === 0 ? <p>{message.content}</p>
                                : <p dangerouslySetInnerHTML={{__html: message.content}}></p>}
                            </div>
                        ))}
                    </div>
                    
                </div>
                <div className='input'>
                    <textarea id='input-text' placeholder='Aa' onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault();
                            addClientMessage(e.target.value);
                            e.target.value = '';
                            e.target.focus();
                            e.target.setSelectionRange(0, 0);
                        }
                    }}/>
                    <button className='submit-message'
                        onClick={(e) => {
                            addClientMessage(document.getElementById('input-text').value);
                            document.getElementById('input-text').value = '';
                            document.getElementById('input-text').focus();
                            document.getElementById('input-text').setSelectionRange(0, 0);
                        }}>
                        Send
                    </button>
                </div>
            </div>
        </div>
    )
}

export default MessageBox;