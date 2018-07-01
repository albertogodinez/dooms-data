import React, { Component } from 'react';
import { Table, Modal, Button, Menu, Dropdown, Icon } from 'antd';

export default class ParticipantProfilesPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: [],
      loading: false,
      selectedParticipant: null,
      sortedInfo: null,
    };
  }

  render() {
    let { sortedInfo } = this.state;
    sortedInfo = sortedInfo || {};
    const columns = [
      {
        title: 'Gamertag',
        dataIndex: 'gamertag',
        key: 'gamertag',
        render: gamertag => `${gamertag}`,
        width: '20%',
        sorter: (a, b) => a.gamertag.length - b.gamertag.length,
        defaultSortOrder: 'descend',
      },
      {
        title: 'Tournaments Entered',
        dataIndex: 'totalNumTournaments',
        key: 'totalNumTournaments',
        width: '20%',
        sorter: (a, b) => a.totalNumTournaments - b.totalNumTournaments,
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
        title: 'Total Sets',
        dataIndex: 'totalNumSets',
        key: 'totalNumSets',
        sorter: (a, b) => a.totalNumSets - b.totalNumSets,
      },
    ];
    return (
      <Table
        columns={columns}
        rowKey={record => record.participantId}
        dataSource={this.props.participantProfiles}
        pagination={{
          pageSize: 20,
          total: this.props.participantProfiles.length,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
        }}
        loading={this.state.loading}
        onChange={this.handleTableChange}
      />
    );
  }
}
