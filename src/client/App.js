import React, { Component } from 'react';
import './app.css';
import { CredentialsPageForm } from './CredentialsPage';

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
    this.state = { view: 'displayCredentialsForm' };
    // this.handler = this.handler.bind(this);
  }

  componentDidMount() {
    // fetch('/api/getUsername').then(res => res.json());
    // .then(user => this.setState({ username: user.username }));
  }

  displayTournaments(tournamentData) {
    // e.preventDefault();
    this.setState({
      view: 'displayTournaments',
    });
    console.log(`in displayTournaments: ${JSON.stringify(tournamentData)}`);
  }

  render() {
    const view = this.state.view;
    return (
      <div>
        {view === 'displayCredentialsForm' ? (
          <CredentialsPageForm changeView={this.displayTournaments.bind(this)} />
        ) : null}
      </div>
    );
  }
}
