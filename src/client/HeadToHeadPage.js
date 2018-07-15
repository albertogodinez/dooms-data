import React, { Component } from 'react';
import axios from 'axios';
import { Card, Icon, Row, Col, Button } from 'antd';

export default class TournamentsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tournamentList: [],
      selectedTournamentIds: []
    };

    // this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTournamentList = this.handleTournamentList.bind(this);
    this.onClick = this.onClick.bind(this);
    this.removeTournament = this.removeTournament.bind(this);
  }
  render() {
    return ( );
  }
}
