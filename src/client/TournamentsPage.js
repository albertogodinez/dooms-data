import React, { Component } from 'react';
import axios from 'axios';
import { Card, Icon, Col, Row, Button } from 'antd';

const TournamentCard = (props) => {
  const date = new Date(props.tournament.tournamentDate);
  return (
    <Col span={8}>
      <Card
        title={props.tournament.tournamentName}
        bordered={false}
        actions={[<Button onClick={props.onClick}>{<Icon type="check-circle" />} </Button>]}
      >
        <p>
          <strong>Tournament type:</strong> {props.tournament.tournamentType}
        </p>
        <p>
          <strong>Tournament date:</strong>
          {date.toLocaleDateString('en-US')}
        </p>
        <a href={props.tournament.challongeUrl}>View Bracket</a>
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
  }

  handleTournamentList() {}

  onClick(index, element) {
    // const updatedIds = this.state.selectedTournamentIds.con;
    // console.log(`index: ${index}  element: ${JSON.stringify(element)}`);
    this.setState({
      selectedTournamentIds: [...this.state.selectedTournamentIds, element.tournamentId],
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    console.log('handling submit');
    const rootUrl = 'http://localhost:4040/';
    axios({
      url: `${rootUrl}participants/?tournamentList=[${this.state.selectedTournamentIds}]`,
      method: 'get',
    }).then((response) => {
      if (response.data) {
        // console.log(response);
        this.props.changeView(response.data);
      }
    });
  }

  render() {
    return (
      <div>
        <h1>Select Tournaments</h1>
        {this.props.tournamentData.map((e, i) => (
          <TournamentCard
            tournament={e}
            key={i}
            onClick={() => {
              this.onClick(i, e);
            }}
          />
        ))}
        <p>state: {JSON.stringify(this.state.selectedTournamentIds)}</p>
        <Button htmlType="submit" onClick={this.handleSubmit}>
          Next
        </Button>
      </div>
    );
  }
}
