import React, { Component } from 'react';
import axios from 'axios/index';
import Cookies from 'universal-cookie';
import { v4 as uuid } from 'uuid';

import Message from './Message'

const cookies = new Cookies();

class Chatbot extends Component {
  messagesEnd;
  constructor(props) {
    super(props);
    this._handleInputKeyPress = this._handleInputKeyPress.bind(this);
    this.state = {
      messages: []
    };

    if (cookies.get('userID') === undefined ) {
      cookies.set('userID', uuid(), {path: '/'});
    };
    console.log(cookies.get('userID'));
  }

  async df_text_query(queryText) {
    let says = {
      speaks: 'me',
      msg: {
        text: {
          text: queryText
        }
      }
    };

    this.setState({messages: [...this.state.messages, says]});
    const res = await axios.post('/api/df_text_query', {text: queryText, userID: cookies.get('userID')});

    for (let msg of res.data.fulfillmentMessages) {
      console.log(JSON.stringify(msg))
      says = {
        speaks: 'bot',
        msg: msg
      }
      this.setState({messages: [...this.state.messages, says]});
    }

  }

  async df_event_query(eventName) {
    const res = await axios.post('/api/df_event_query', {event: eventName, userID: cookies.get('userID')});

    for (let msg of res.data.fulfillmentMessages) {
      let says = {
        speaks: 'bot',
        msg: msg
      }
      this.setState({messages: [...this.state.messages, says]});
    }
  }

  componentDidMount() {
    this.df_event_query('Welcome');
  }

  componentDidUpdate() {
    this.messagesEnd.scrollIntoView({ behaviour: "smooth"});
    this._input.focus();
  }

  renderMessages(stateMessages) {
    if(stateMessages) {
      return stateMessages.map((message, i) => {
        if (message.msg && message.msg.text && message.msg.text.text) {
          return <Message key={i} speaks={message.speaks} text={message.msg.text.text} />;
        } else {
          // eslint-disable-next-line no-unused-expressions
          <h2>Cards</h2>
        }

        
      });
    } else {
      return null;
    }
  }

  _handleInputKeyPress(e) {
    if(e.key === 'Enter') {
      this.df_text_query(e.target.value);
      e.target.value = '';
    }
  }

  render() {
    return (
      <div style={{ height: 400, width: 400, float: 'right' }}>
        <div id="chatbot" style={{ height: '100%', width: '100%', overflow: 'auto' }}>
          <h2>Chatbot</h2>
          {this.renderMessages(this.state.messages)}
          <div ref={(el) => {this.messagesEnd = el;}}
            style={{float: 'left', clear: "both"}} >
          </div>
          <input type="text" onKeyPress={this._handleInputKeyPress} autoFocus={true} ref={c => (this._input = c)}/>
        </div>
      </div>
    ) 
  }

}
export default Chatbot;