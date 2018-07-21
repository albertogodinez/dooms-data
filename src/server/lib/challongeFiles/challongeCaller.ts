import axios from 'axios';
import { TournamentData } from './tournament.data';
import { ParticipantData } from './participant.data';
import { MatchData } from './match.data';
import { Credentials } from '../credentials';

export class ChallongeCaller {
  tournamentList: TournamentData[];
  participantMap: Map<number, ParticipantData> = new Map(); // key is participantId
  matchesMap: Map<number, MatchData> = new Map(); // key is matchId
  temporaryValues: any[];
  credentials: Credentials = new Credentials();

  public getTournaments(username: string, apiKey: string, begDate?: string, endDate?: string) {
    this.resetData;
    //}
    console.log('getTournaments created_after date+ ' + begDate);
    console.log('getTournaments created_before date+ ' + endDate);
    let url = `https://${username}:${apiKey}@api.challonge.com/v1/tournaments.json`;
    return axios
      .get(url, {
        params: {
          created_after: begDate,
          created_before: endDate,
        },
      })
      .then(response => {
        console.log('setting apiKey: ' + apiKey + '  AND username: ' + username);
        this.credentials.challongeApiKey = apiKey;
        this.credentials.challongeUsername = username;
        return this.handleTournaments(response.data);
      })
      .catch(err => this.handleError('getTournaments()', err));
  }

  getParticipants(tournamentList) {
    console.log('current api: ' + this.credentials.challongeApiKey);
    console.log('current username: ' + this.credentials.challongeUsername);

    let promises = [];

    for (let i = 0; i < tournamentList.length; i++) {
      promises.push(
        axios.get(
          `https://${this.credentials.challongeUsername}:${
            this.credentials.challongeApiKey
          }@api.challonge.com/v1/tournaments/${tournamentList[i]}/participants.json`,
        ),
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
          return values;
        }),
      )
      .catch(err => this.handleError('getParticipants()', err));
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
          updatedParticipant.gamertag,
      );
      this.participantMap.get(updatedParticipant.participantId).gamertag =
        updatedParticipant.gamertag;
    });
    this.participantMap.forEach(this.logMapElements);

    let values = Array.from(this.participantMap.values());
    return values;
  }

  getMatches(tournamentList) {
    console.log('getMatches() for tournaments : ' + tournamentList);
    let promises = [];

    for (let i = 0; i < tournamentList.length; i++) {
      promises.push(
        axios.get(
          `https://${this.credentials.challongeUsername}:${
            this.credentials.challongeApiKey
          }@api.challonge.com/v1/tournaments/${tournamentList[i]}/matches.json`,
        ),
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
          // console.log('returning participantData array: ' + JSON.stringify(values));
          return values;
        }),
      )
      .catch(err => this.handleError('getMatches()', err));
  }

  /*
  * *********** HELPERS ***********
  * Classes meant to help edit data class
  */
  public getParticipantProfiles(tournamentList): Promise<any> {
    return new Promise(resolve => {
      this.getParticipants(tournamentList)
        .then(res => {
          // console.log('getParticipantProfiles then response - ' + JSON.stringify(res));
          return new Promise(resolve => {
            resolve(this.getMatches(tournamentList));
          });
        })
        .then(res => {
          let participantProfiles = this.createParticipantProfiles();
          resolve(participantProfiles);
        })
        .catch(error => {
          this.handleError('getParticipantProfiles()', error);
        });
    });
  }

  /*
  * *********** HANDLERS ***********
  * Help handle data received from challonge
  */

  private handleMatches(responseData: any) {
    //console.log('responseData: ' + JSON.stringify(responseData));
    // console.log('converting challonge response to MatchData');
    responseData.map(match => {
      let md: MatchData = new MatchData();
      md.matchId = match.match.id;
      md.winnerId = match.match.winner_id;
      md.loserId = match.match.loser_id;
      this.matchesMap.set(md.matchId, md);
    });
  }

  private handleParticipants(responseData: any) {
    console.log('converting challonge response to ParticipantData');
    responseData.map(participant => {
      let pd = new ParticipantData();
      pd.participantId = participant.participant.id;
      pd.gamertag = participant.participant.name;
      pd.totalNumTournaments++;
      pd.highestPlacing = participant.participant.final_rank;
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

  createParticipantProfiles() {
    console.log('obtaining participant profiles');
    this.matchesMap.forEach(match => {
      // console.log('matchId: ' + match.matchId);
      let pdWinner: ParticipantData = this.participantMap.get(match.winnerId);
      let pdLoser: ParticipantData = this.participantMap.get(match.loserId);
      pdWinner.listOfWins.push(pdLoser.gamertag);
      pdWinner.totalNumSets++;
      pdWinner.totalNumWins++;

      pdLoser.listOfLosses.push(pdWinner.gamertag);
      pdLoser.totalNumSets++;
      pdLoser.totalNumLosses++;

      pdWinner.winningPercentage = (pdWinner.totalNumWins / pdWinner.totalNumSets) * 100;
      pdLoser.winningPercentage = (pdLoser.totalNumWins / pdLoser.totalNumSets) * 100;

      this.participantMap.set(match.winnerId, pdWinner);
      this.participantMap.set(match.loserId, pdLoser);
    });
    console.log('matches have been finished');
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
        seen.get(seenKey).totalNumTournaments += participant.totalNumTournaments;
        seen.get(seenKey).winningPercentage =
          (seen.get(seenKey).totalNumWins / seen.get(seenKey).totalNumSets) * 100;
        seen.get(seenKey).highestPlacing =
          seen.get(seenKey).highestPlacing < participant.highestPlacing
            ? seen.get(seenKey).highestPlacing
            : participant.highestPlacing;
        // console.log('combined player: ' + JSON.stringify(seen.get(seenKey)));
      } else {
        let tempKey: string = String(participant.gamertag.toUpperCase().trim());
        seen.set(tempKey, participant);
      }
    });
    let values = Array.from(seen.values());
    this.temporaryValues = values;
    return values;
    // console.log('playerProfiles after combining: ' + JSON.stringify(values));
    // let promiseParticipantData = new Promise((resolve, reject) => {
    //   resolve(values);
    // });
    // return promiseParticipantData;
  }

  //TODO: this is temporary.
  //reseting data when starting from the beginning
  private resetData() {
    this.tournamentList = [];
    this.participantMap = new Map();
    this.matchesMap = new Map();
  }

  private handleError(methodName: string, error: Error) {
    console.log('error occured in challongCaller: ' + error + '   in method: ' + methodName);
  }
}
