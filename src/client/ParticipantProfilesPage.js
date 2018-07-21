import React, { Component } from 'react';
import { Table, Card, List, Button } from 'antd';
import PropTypes from 'prop-types';

const tabList = [
  {
    key: 'victories',
    tab: 'Victories',
  },
  {
    key: 'losses',
    tab: 'Losses',
  },
];

const ParticipantCard = (props) => {
  const listOfWins = props.state.selectedParticipant.listOfWins;
  const listOfLosses = props.state.selectedParticipant.listOfLosses;
  return (
    <Card title={props.state.selectedParticipant.gamertag} bordered={false}>
      <p>
        <strong>Total Wins:</strong> {props.state.selectedParticipant.totalNumWins}
      </p>
      <p>
        <strong>Total Losses:</strong> {props.state.selectedParticipant.totalNumLosses}
      </p>
      <p>
        <strong>Winning Percentage:</strong>{' '}
        {props.state.selectedParticipant.winningPercentage.toPrecision(4)}%
      </p>
      <p>
        <strong>Top Placing:</strong> {props.state.selectedParticipant.highestPlacing}
      </p>
      <p>
        <strong>Total Sets:</strong> {props.state.selectedParticipant.totalNumSets}
      </p>
      <p>
        <strong>Total Tournaments Entered:</strong>{' '}
        {props.state.selectedParticipant.totalNumTournaments}
      </p>
      <br />
      <br />
      <Card
        style={{ width: '100%' }}
        tabList={tabList}
        activeTabKey={props.state.tabKey}
        onTabChange={(tabKey) => {
          props.onTabChange(tabKey, 'tabKey');
        }}
        actions={[<Button onClick={props.onBack}>Back</Button>]}
      >
        {props.state.tabKey === 'victories' ? (
          <List
            size="small"
            bordered
            dataSource={listOfWins}
            renderItem={item => <List.Item>{item}</List.Item>}
          />
        ) : (
          <List
            size="small"
            bordered
            dataSource={listOfLosses}
            renderItem={item => <List.Item>{item}</List.Item>}
          />
        )}
      </Card>
    </Card>
  );
};

export default class ParticipantProfilesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      selectedParticipant: null,
    };
    this.onClick = this.participantSelected.bind(this);
    this.onBack = this.onBack.bind(this);
  }

  onBack() {
    // event.preventDefault();
    this.setState({
      selectedParticipant: null,
    });
  }

  onTabChange(key, keyType) {
    this.setState({ [keyType]: key });
  }

  participantSelected(participant) {
    console.log(`participant selected: ${JSON.stringify(participant)}`);
    this.setState({
      selectedParticipant: participant,
    });
  }

  render() {
    const columns = [
      {
        title: 'Gamertag',
        dataIndex: 'gamertag',
        key: 'gamertag',
        render: gamertag => <a href="javascript:;">{gamertag}</a>,
        width: '20%',
        // TODO: ADD SORTER FOR NAMES
        // sorter: (a, b) => a.toString().localeCompare(b.toString()),
        // onClick: gamertag => this.onClick(gamertag),
      },
      {
        title: 'Tournaments Entered',
        dataIndex: 'totalNumTournaments',
        key: 'totalNumTournaments',
        width: '20%',
        sorter: (a, b) => a.totalNumTournaments - b.totalNumTournaments,
      },
      {
        title: 'Top Placing',
        dataIndex: 'highestPlacing',
        key: 'totalNumSets',
        sorter: (a, b) => a.highestPlacing - b.highestPlacing,
      },
      {
        title: 'Total Wins',
        dataIndex: 'totalNumWins',
        key: 'totalNumWins',
        sorter: (a, b) => a.totalNumWins - b.totalNumWins,
      },
      {
        title: 'Total Losses',
        dataIndex: 'totalNumLosses',
        key: 'totalNumLosses',
        sorter: (a, b) => a.totalNumLosses - b.totalNumLosses,
      },
      {
        title: 'Winning Percentage',
        dataIndex: 'winningPercentage',
        key: 'winningPercentage',
        render: winningPercentage => `${winningPercentage.toPrecision(4)}%`,
        sorter: (a, b) => a.winningPercentage - b.winningPercentage,
      },
    ];
    return (
      <div>
        {!this.state.selectedParticipant ? (
          <Table
            columns={columns}
            rowKey={record => record.participantId}
            dataSource={this.props.participantProfiles}
            pagination={{
              pageSize: 50,
              total: this.props.participantProfiles.length,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            }}
            onRow={row => ({
              // Sending columns allows it to send the entire row data
              onClick: () => {
                this.participantSelected(row);
              },
            })}
            loading={this.state.loading}
            onChange={this.handleTableChange}
            onClick={this.onClick}
          />
        ) : (
          <ParticipantCard
            state={this.state}
            onTabChange={(key, keyType) => {
              this.onTabChange(key, keyType);
            }}
            onBack={() => {
              this.onBack();
            }}
          />
        )}
      </div>
    );
  }
}

ParticipantProfilesPage.defaultProps = {
  participantProfiles: null,
  changeView: null,
};

ParticipantProfilesPage.propTypes = {
  participantProfiles: PropTypes.arrayOf(PropTypes.shape({
    participantId: PropTypes.number,
    gamertag: PropTypes.string,
    totalNumTournaments: PropTypes.number,
    firstAttendedDate: PropTypes.date,
    lastAttendedDate: PropTypes.date,
    active: PropTypes.boolean,
    totalNumWins: PropTypes.number,
    totalNumLosses: PropTypes.number,
    totalNumSets: PropTypes.number,
    listOfWins: PropTypes.arrayOf(PropTypes.string),
    listOfLosses: PropTypes.arrayOf(PropTypes.string),
    listOfTournamentUrls: PropTypes.arrayOf(PropTypes.string),
    winningPercentage: PropTypes.number,
  })),
};
