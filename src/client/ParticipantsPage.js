import React, { Component } from 'react';
import axios from 'axios';
import { List, Modal, Button, Menu, Dropdown, Icon } from 'antd';
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
      visible: false,
      loading: false,
      selectedParticipant: null,
    };
    this.showModal = this.showModal.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  showModal(item) {
    // console.log(`showModal(): ${JSON.stringify(item)}`);
    this.setState({
      visible: true,
      selectedParticipant: item,
    });
    // console.log(JSON.stringify(this.state.selectedParticipant));
  }

  handleOk() {
    console.log('got to here1');
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({
        loading: false,
        visible: false,
        // selectedParticipant: null,
      });
    }, 3000);
  }

  handleCancel() {
    console.log('got to here');
    this.setState({
      visible: false,
      // selectedParticipant: null,
    });
  }

  renderModal() {
    let modal;
    const menu = (
      <Menu>
        {this.props.participantData.map((participant, i) => {
          if (participant !== undefined) {
            console.log(`participant.gamertag; ${participant.gamertag} key: ${i}`);
              <Menu.Item key={i}>{participant.gamertag}</Menu.Item>;
          }
        })}
      </Menu>
    );

    if (this.state.selectedParticipant) {
      // console.log(`selectedParticipant: ${JSON.stringify(this.state.selectedParticipant)}`);
      // console.log(`participantData size: ${this.props.participantData.length}`);
      modal = (
        <Modal
          visible={this.state.visible}
          title={this.state.selectedParticipant.gamertag}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              Back
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={this.state.loading}
              onClick={this.handleOk}
            >
              Confirm
            </Button>,
          ]}
        >
          <p>Edit Player</p>
          <Dropdown overlay={menu} trigger={['click']}>
            <a className="ant-dropdown-link" href="#">
              Select Player<Icon type="down" />
            </a>
          </Dropdown>
        </Modal>
      );
    }
    return modal;
  }

  render() {
    const { visible, loading } = this.state;
    return (
      <div>
        <List
          style={listStyle}
          itemLayout="horizontal"
          dataSource={this.props.participantData}
          renderItem={item => (
            <List.Item actions={[<a onClick={this.showModal.bind(this, item)}>edit</a>]}>
              <List.Item.Meta title={item.gamertag} />
            </List.Item>
          )}
        />
        {this.renderModal()}
      </div>
    );
  }
}
