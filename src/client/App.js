import React, { Component } from 'react';
import axios from 'axios';
import './app.css';
import { CredentialsPageForm } from './CredentialsPage';
import TournamentsPage from './TournamentsPage';
import ParticipantProfilesPage from './ParticipantProfilesPage';
// import HeadToHeadPage from './HeadToHeadPage';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 'displayCredentialsForm',
      tournamentData: [],
      selectedTournamentIds: [],
      participantProfiles: [],
    };
    // this.handler = this.handler.bind(this);
    this.displayParticipantProfiles = this.displayParticipantProfiles.bind(this);
  }

  componentDidMount() {
    // fetch('/api/getUsername').then(res => res.json());
    // .then(user => this.setState({ username: user.username }));
  }

  getParticipantProfiles() {
    console.log('handling submit');
    const rootUrl = process.env.NODE_ENV === 'production' ? '/api/' : 'http://localhost:4040/api/';
    axios({
      url: `${rootUrl}playerProfiles/?tournamentList=[${this.state.selectedTournamentIds}]`,
      method: 'get',
    }).then((response) => {
      if (response.data) {
        this.setState({
          view: 'displayParticipantProfiles',
          participantProfiles: response.data.playerProfiles,
        });
      }
    });
  }

  displayTournaments(td) {
    this.setState({
      view: 'displayTournaments',
      tournamentData: td.tournaments,
    });
  }

  displayParticipants(pd, tList) {
    this.setState({
      selectedTournamentIds: tList,
    });
    this.getParticipantProfiles();
  }

  displayParticipantProfiles(ptcpntPro) {
    this.setState({
      view: 'displayParticipantProfiles',
      participantProfiles: ptcpntPro.playerProfiles,
    });
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
        {/* {view === 'displayParticipants' ? (
          <ParticipantsPage participantData={this.state.participantData} />
        ) : null} */}
        {view === 'displayParticipantProfiles' ? (
          <ParticipantProfilesPage participantProfiles={this.state.participantProfiles} />
        ) : null}
        {/* {view === 'displayHeadToHead' ? (
          <HeadToHeadPage participantProfiles={this.state.participantProfiles} />
        ) : null} */}
      </div>
    );
  }
}
