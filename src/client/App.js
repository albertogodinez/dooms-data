import React, { Component } from 'react';
import './app.css';
import { CredentialsPageForm } from './CredentialsPage';
import TournamentsPage from './TournamentsPage';
import ParticipantsPage from './ParticipantsPage';

// const handlers = {
//   initLoad: value => <CredentialsPageForm />,
// };

// const displayData = (type, value) => {
//   const handler = handlers[type] || handlers.default;
//   return handler(value);
// };

// const DataDisplay = ({ type, value }) => {
//   displayData(type, value);
// };

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 'displayCredentialsForm',
      tournamentData: [],
      participantData: [],
    };
    // this.handler = this.handler.bind(this);
  }

  componentDidMount() {
    // fetch('/api/getUsername').then(res => res.json());
    // .then(user => this.setState({ username: user.username }));
  }

  displayTournaments(td) {
    // e.preventDefault();
    this.setState({
      view: 'displayTournaments',
      tournamentData: td.tournaments,
    });
    console.log(`in displayTournaments: ${JSON.stringify(this.state.tournamentData)}`);
  }

  displayParticipants(pd) {
    this.setState({
      view: 'displayParticipants',
      participantData: pd.participants,
    });
    console.log(`in displayParticipants: ${JSON.stringify(pd.participants)}`);
  }

  render() {
    const view = this.state.view;
    return (
      <div>
        {view === 'displayCredentialsForm' ? (
          <CredentialsPageForm changeView={this.displayTournaments.bind(this)} />
        ) : null}
        {view === 'displayTournaments' ? (
          <TournamentsPage
            tournamentData={this.state.tournamentData}
            changeView={this.displayParticipants.bind(this)}
          />
        ) : null}
        {view === 'displayParticipants' ? (
          <ParticipantsPage participantData={this.state.participantData} />
        ) : null}
      </div>
    );
  }
}
