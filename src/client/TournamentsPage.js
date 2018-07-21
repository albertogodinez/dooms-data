import React, { Component } from 'react';
import axios from 'axios';
import { Card, Icon, Row, Col, Button } from 'antd';
import PropTypes from 'prop-types';

const gridStyle = {
  textAlign: 'center',
  paddingBottom: '10px',
};

const TournamentCard = (props) => {
  const date = new Date(props.tournament.tournamentDate);
  return (
    <Col span={6} offset={1}>
      <Card
        style={gridStyle}
        title={props.tournament.tournamentName}
        bordered
        hoverable
        actions={[
          <Button onClick={props.onClick}>
            {props.selected ? <Icon type="close-circle" /> : <Icon type="check-circle" />}
          </Button>,
        ]}
      >
        <p>
          <strong>Tournament date: </strong>
          {date.toLocaleDateString('en-US')}
        </p>
        <a href={props.tournament.challongeUrl} rel="noopener noreferrer" target="_blank">
          View Bracket
        </a>
      </Card>
    </Col>
  );
};

export default class TournamentsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTournamentIds: [],
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onClick = this.onClick.bind(this);
    this.removeTournament = this.removeTournament.bind(this);
  }

  // RENAME THIS
  onClick(i, element) {
    console.log('onClick');
    const index = this.state.selectedTournamentIds.indexOf(element.tournamentId);
    if (index < 0) {
      // Adding this to selected tournament ids
      console.log(`adding element: ${element.tournamentId}`);
      this.setState({
        selectedTournamentIds: [...this.state.selectedTournamentIds, element.tournamentId],
      });
    } else {
      console.log(`removing element: ${element.tournamentId}`);
      const updatedSelectedTournaments = [...this.state.selectedTournamentIds];
      updatedSelectedTournaments.splice(index, 1);
      this.setState({
        selectedTournamentIds: updatedSelectedTournaments,
      });
    }
  }

  // TODO: Make this more efficient
  removeTournament(element) {
    console.log(`removing tournament: ${element.tournamentId}`);
    const updatedSelectedTournaments = [...this.state.selectedTournamentIds];
    const index = updatedSelectedTournaments.indexOf(element.tournamentId);
    updatedSelectedTournaments.splice(index, 1);
    this.setState({
      selectedTournamentIds: updatedSelectedTournaments,
    });
  }

  tournamentInQueue(tournamentId) {
    if (
      this.state.selectedTournamentIds === null ||
      this.state.selectedTournamentIds === undefined
    ) {
      return false;
    }
    if (this.state.selectedTournamentIds.indexOf(tournamentId) >= 0) {
      console.log(`tournamentId: ${tournamentId} does exist`);
      return true;
    }
    return false;
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log('handling submit');
    const rootUrl = process.env.NODE_ENV === 'production' ? '/api/' : 'http://localhost:4040/api/';
    axios({
      url: `${rootUrl}participants/?tournamentList=[${this.state.selectedTournamentIds}]`,
      method: 'get',
    }).then((response) => {
      if (response.data) {
        this.props.changeView(response.data, this.state.selectedTournamentIds);
      }
    });
  }

  render() {
    return (
      <div>
        <h1>Select Tournaments</h1>
        <Row>
          {this.props.tournamentData.map((e, i) => (
            <TournamentCard
              tournament={e}
              key={e.tournamentId}
              onClick={() => {
                this.onClick(i, e);
              }}
              selected={this.state.selectedTournamentIds.indexOf(e.tournamentId) >= 0}
            />
          ))}
        </Row>
        <Row>
          <Col offset={2}>
            <br />
            <label>Selected Tournaments: {JSON.stringify(this.state.selectedTournamentIds)}</label>
          </Col>
        </Row>
        <Row>
          <Col offset={2}>
            <br /> <br />
            <Button
              htmlType="submit"
              onClick={this.handleSubmit}
              disabled={this.state.selectedTournamentIds.length === 0}
            >
              Next
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}

TournamentsPage.defaultProps = {
  tournamentData: null,
  changeView: null,
};

TournamentsPage.propTypes = {
  tournamentData: PropTypes.arrayOf(PropTypes.shape({
    tournamentId: PropTypes.any,
    tournamentName: PropTypes.string,
    tournamentDate: PropTypes.date,
    tournamentType: PropTypes.string,
    challongeUrl: PropTypes.string,
    state: PropTypes.string,
    listOfParticipants: PropTypes.arrayOf(PropTypes.string),
  })),
  changeView: PropTypes.func,
};
