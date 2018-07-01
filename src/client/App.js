import React, { Component } from 'react';
import axios from 'axios';
import './app.css';
import { CredentialsPageForm } from './CredentialsPage';
import TournamentsPage from './TournamentsPage';
import ParticipantProfilesPage from './ParticipantProfilesPage';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      view: 'displayCredentialsForm',
      tournamentData: [],
      participantData: [],
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
    const rootUrl = 'http://localhost:4040/';
    axios({
      url: `${rootUrl}matches/?tournamentList=[${this.state.selectedTournamentIds}]`,
      method: 'get',
    }).then((matches) => {
      if (matches.data) {
        console.log('getting playerProfiles');
        axios({
          url: `${rootUrl}playerProfiles/`,
          method: 'get',
        }).then((response) => {
          if (response.data) {
            console.log(`Player Profiles: ${JSON.stringify(response.data)}`);
            this.setState({
              view: 'displayParticipantProfiles',
              participantProfiles: response.data.playerProfiles,
            });
            // displayParticipantProfiles(response.data);
          }
        });
        // this.props.changeView(response.data);
      }
    });
  }

  displayTournaments(td) {
    // e.preventDefault();
    this.setState({
      view: 'displayTournaments',
      tournamentData: td.tournaments,
    });
    // console.log(`in displayTournaments: ${JSON.stringify(this.state.tournamentData)}`);
  }

  displayParticipants(pd, tList) {
    this.setState({
      // view: 'displayParticipants',
      participantData: pd.participants,
      selectedTournamentIds: tList,
    });
    // console.log(`in displayParticipants: ${JSON.stringify(pd.participants)}`);
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
      </div>
    );
  }
}
