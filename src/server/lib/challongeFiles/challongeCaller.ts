import axios from 'axios';
import { TournamentData } from './tournament.data';
import { ParticipantData } from './participant.data';
import { MatchData } from './match.data';

export class ChallongeCaller {
  tournamentList: TournamentData[];
  participantMap: Map<number, ParticipantData> = new Map(); // key is participantId
  matchesMap: Map<number, MatchData> = new Map(); // key is matchId

  //TODO: NEED TO OBTAIN JUST THE TOURNAMENTS THAT THEY ARE USING
  //THIS SHOULD HAPPEN WHENEVER THEY ARE GETTING PARTICIPANTS

  //TODO: STORE THESE VALUES IN A SEPERATE FILE
  //where we hold all of the constants
  private api: string;
  private username: string;

  public getTournaments(
    username: string,
    apiKey: string,
    begDate?: string,
    endDate?: string
  ) {
    //if (this.tournamentList !== undefined) {
    this.resetData;
    //}
    console.log('getTournaments created_after date+ ' + begDate);
    console.log('getTournaments created_before date+ ' + endDate);
    this.username = username;
    this.api = apiKey;
    let url = `https://${username}:${apiKey}@api.challonge.com/v1/tournaments.json`;
    return axios
      .get(url, {
        params: {
          created_after: begDate,
          created_before: endDate
        }
      })
      .then(response => {
        //console.log('getTournaments() response from challonge: ' + response.data);
        return this.handleTournaments(response.data);
      })
      .catch(ex => this.handleError(ex));
  }

  public getParticipants(tournamentList) {
    console.log('current api: ' + this.api);
    console.log('current username: ' + this.username);

    let promises = [];

    for (let i = 0; i < tournamentList.length; i++) {
      promises.push(
        axios.get(
          `https://${this.username}:${
            this.api
          }@api.challonge.com/v1/tournaments/${
            tournamentList[i]
          }/participants.json`
        )
      );
    }
    return axios
      .all(promises)
      .then(
        axios.spread((...args) => {
          for (let i = 0; i < args.length; i++) {
            this.handleParticipants(args[i].data);
          }
          let values = Array.from(this.participantMap.values());
          //console.log('returning participantData array: ' + JSON.stringify(values));
          return values;
        })
      )
      .catch(err => this.handleError(err));
  }

  logMapElements(value, key, map) {
    console.log(`m[${key}] = ${JSON.stringify(value)}`);
  }

  public updateParticipants(updatedParticipants: ParticipantData[]) {
    updatedParticipants.forEach(updatedParticipant => {
      //updates gamertag to whatever user inputed
      console.log(
        'previous gamertag: ' +
          this.participantMap.get(updatedParticipant.participantId).gamertag +
          ' updating to the following gamertag: ' +
          updatedParticipant.gamertag
      );
      this.participantMap.get(updatedParticipant.participantId).gamertag =
        updatedParticipant.gamertag;
    });
    console.log('updateParticipants() returning: ---- ');
    this.participantMap.forEach(this.logMapElements);

    let values = Array.from(this.participantMap.values());
    return values;
  }

  public getMatches(tournamentList) {
    let promises = [];

    for (let i = 0; i < tournamentList.length; i++) {
      promises.push(
        axios.get(
          `https://${this.username}:${
            this.api
          }@api.challonge.com/v1/tournaments/${tournamentList[i]}/matches.json`
        )
      );
    }
    return axios
      .all(promises)
      .then(
        axios.spread((...args) => {
          for (let i = 0; i < args.length; i++) {
            this.handleMatches(args[i].data);
          }
          let values = Array.from(this.matchesMap.values());
          //console.log('returning participantData array: ' + JSON.stringify(values));
          return values;
        })
      )
      .catch(err => this.handleError(err));
  }

  /*
  * *********** HELPERS ***********
  * Classes meant to help edit data class
  */
  public getParticipantProfiles() {
    console.log('obtaining participant profiles');
    this.matchesMap.forEach(match => {
      console.log('matchId: ' + match.matchId);
      let pdWinner: ParticipantData = this.participantMap.get(match.winnerId);
      let pdLoser: ParticipantData = this.participantMap.get(match.loserId);
      pdWinner.listOfWins.push(pdLoser.gamertag);
      pdWinner.totalNumSets++;
      pdWinner.totalNumWins++;

      pdLoser.listOfLosses.push(pdWinner.gamertag);
      pdLoser.totalNumSets++;
      pdLoser.totalNumLosses++;

      pdWinner.winningPercentage =
        (pdWinner.totalNumWins / pdWinner.totalNumSets) * 100;
      pdLoser.winningPercentage =
        (pdLoser.totalNumWins / pdLoser.totalNumSets) * 100;

      this.participantMap.set(match.winnerId, pdWinner);
      this.participantMap.set(match.loserId, pdLoser);
    });
    console.log('matches have been finished');
    console.log(
      'playerProfiles before combining: ' +
        JSON.stringify(Array.from(this.participantMap.values()))
    );
    //COMBINE PARTICIPANTS WITH SAME GAMERTAG

    let seen: Map<string, ParticipantData> = new Map(); // key is gamertag
    this.participantMap.forEach(participant => {
      // Have we seen this label before?
      let seenKey = String(participant.gamertag.toUpperCase().trim());
      if (seen.has(seenKey)) {
        // Yes, grab it and add this data to it
        // previous = seen[participant.gamertag];
        // previous.data.push(participant);
        seen.get(seenKey).listOfWins.push(...participant.listOfWins);
        seen.get(seenKey).listOfLosses.push(...participant.listOfLosses);
        seen.get(seenKey).totalNumSets += participant.totalNumSets;
        seen.get(seenKey).totalNumWins += participant.totalNumWins;
        seen.get(seenKey).totalNumLosses += participant.totalNumLosses;
        seen.get(seenKey).totalNumTournaments +=
          participant.totalNumTournaments;
        console.log('combined player: ' + JSON.stringify(seen.get(seenKey)));
      } else {
        let tempKey: string = String(participant.gamertag.toUpperCase().trim());
        seen.set(tempKey, participant);
      }
    });
    let values = Array.from(seen.values());
    console.log('playerProfiles after combining: ' + JSON.stringify(values));
    return values;
  }

  //returns key of duplicate
  private findDuplicateParticipantByGamertag(
    participant: ParticipantData
  ): number {
    console.log('findDuplicateParticipantByGamertag()');
    for (let currPd of this.participantMap.values()) {
      if (
        currPd.gamertag.toUpperCase === participant.gamertag.toUpperCase &&
        currPd.participantId !== participant.participantId
      ) {
        return currPd.participantId;
      }
    }
    return null;
  }

  private combineTwoParticipants(
    participant: ParticipantData,
    participantRemove: ParticipantData
  ) {
    console.log(
      'participants being combined: ' +
        JSON.stringify(participant) +
        '  -----  ' +
        JSON.stringify(participantRemove)
    );
    participant.listOfWins.push(...participantRemove.listOfWins);
    participant.listOfLosses.push(...participantRemove.listOfLosses);
    participant.totalNumSets += participantRemove.totalNumSets;
    participant.totalNumWins += participantRemove.totalNumWins;
    participant.totalNumLosses += participantRemove.totalNumLosses;
    participant.totalNumTournaments += participantRemove.totalNumTournaments;
    // this.participantMap.delete(participantRemove.participantId);
  }

  private findParticipantByGamertag(gamertag: string): ParticipantData {
    console.log('findParticipantByGamertag()');
    for (let participant of this.participantMap.values()) {
      if (participant.gamertag === gamertag) {
        return participant;
      }
    }
    return null;
  }
  /*
  * *********** HANDLERS ***********
  * Help handle data received from challonge
  */

  private handleMatches(responseData: any) {
    //console.log('responseData: ' + JSON.stringify(responseData));
    console.log('converting challonge response to MatchData');
    responseData.map(match => {
      let md: MatchData = new MatchData();
      md.matchId = match.match.id;
      md.winnerId = match.match.winner_id;
      md.loserId = match.match.loser_id;
      this.matchesMap.set(md.matchId, md);
    });
  }

  //need to go through existing participants and see if gamertag exists
  //if it does, then need to add it to that ParticipantData
  private handleParticipants(responseData: any) {
    console.log('converting challonge response to ParticipantData');
    responseData.map(participant => {
      let pd = new ParticipantData();
      pd.participantId = participant.participant.id;
      pd.gamertag = participant.participant.name;
      pd.totalNumTournaments++;
      this.participantMap.set(pd.participantId, pd);
    });
  }

  private handleTournaments(responseData: any) {
    this.tournamentList = responseData
      .filter(elem => {
        // edit this or create a constant
        return elem.tournament.state === 'complete';
      })
      .map(function(elem) {
        //console.log('adding tournament - ' + elem.tournament.name);
        const td: TournamentData = new TournamentData();
        td.tournamentId = elem.tournament.id;
        td.tournamentName = elem.tournament.name;
        td.tournamentType = elem.tournament.tournament_type;
        td.challongeUrl = elem.tournament.full_challonge_url;
        td.state = elem.tournament.state;
        td.tournamentDate = elem.tournament.created_at;
        return td;
      });
    //console.log('tournaments have been handled: returning the following: ' + JSON.stringify(this.tournamentList));
    return this.tournamentList;
  }

  //TODO: this is temporary.
  //reseting data when starting from the beginning
  private resetData() {
    this.tournamentList = [];
    this.participantMap = new Map();
    this.matchesMap = new Map();
  }

  private handleError(error: Error) {
    console.log('error occured in challongCaller: ' + error);
  }
}
