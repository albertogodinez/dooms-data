import React, { Component } from 'react';
import axios from 'axios';
import { List } from 'antd';
// import { Card, Icon, Col, Row, Button } from 'antd';

const listStyle = {
  width: '50%',
};

export default class ParticipantsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      participantList: [],
      participantListUpdated: [],
    };
  }

  render() {
    return (
      <List
        style={listStyle}
        itemLayout="horizaontal"
        dataSource={this.props.participantData}
        renderItem={item => (
          <List.Item actions={[<a>edit</a>]}>
            <List.Item.Meta title={item.gamertag} />
          </List.Item>
        )}
      />
    );
  }
}
