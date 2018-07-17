import React, { Component } from 'react';
import axios from 'axios';
import { Card, Icon, Row, Col, Button } from 'antd';

const gridStyle = {
  textAlign: 'center',
  paddingBottom: '10px',
};

const TournamentCard = (props) => {
  const date = new Date(props.tournament.tournamentDate);
  // const addTournament = () => {
  //   console.log('addTournament() called');
  //   props.onClick;
  //   // props.selected = true;
  // };
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
        <p>{/* <strong>Tournament type:</strong> {props.tournament.tournamentType} */}</p>
        <p>
          <strong>Tournament date: </strong>
          {date.toLocaleDateString('en-US')}
        </p>
        <a href={props.tournament.challongeUrl} target="_blank">
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
      tournamentList: [],
      selectedTournamentIds: [],
    };

    // this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTournamentList = this.handleTournamentList.bind(this);
    this.onClick = this.onClick.bind(this);
    this.removeTournament = this.removeTournament.bind(this);
  }

  handleTournamentList() {}

  // RENAME THIS
  onClick(i, element) {
    console.log('onClick');
    // if(this.selectedTournamentIds.length === 0) {
    //   this.setState({
    //     selectedTournamentIds: [...this.state.selectedTournamentIds]
    //   })
    // }
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
    // console.log(`tournamentId: ${tournamentId}`);
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
    // const rootUrl = 'http://localhost:4040/';
    // const rootUrl = '/api/';
    axios({
      url: `${rootUrl}participants/?tournamentList=[${this.state.selectedTournamentIds}]`,
      method: 'get',
    }).then((response) => {
      if (response.data) {
        // console.log(response);
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
              key={i}
              onClick={() => {
                this.onClick(i, e);
              }}
              selected={this.state.selectedTournamentIds.indexOf(e.tournamentId) >= 0}
              // selected={this.tournamentInQueue(e.tournamentId)}
            />
          ))}
          {/* <p>state: {JSON.stringify(this.state.selectedTournamentIds)}</p> */}
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
