import axios from "axios";
import { TournamentData } from './tournament.data';

export class ChallongeCaller {
  tournamentList: TournamentData[];
  //TODO: STORE THESE VALUES IN A SEPERATE FILE
  private api: string;
  private username: string;

  public getTournaments(username: string, apiKey: string, begDate?: Date, endDate?: Date) {
    console.log('getTournaments created_after date+ ' + begDate);
    console.log('getTournaments created_before date+ ' + endDate);
    let url = `https://${username}:${apiKey}@api.challonge.com/v1/tournaments.json`
    return axios.get(url, {
      params: {
        created_after: begDate,
        created_before: endDate
      }
    })
    .then(response => {
      console.log('response from challonge: ' + response.data);
      return this.handleTournaments(response.data);
    })
    .catch(ex => this.handleError(ex))
  }
  
  public getParticipants(tournamentList: TournamentData[]) {
    let url = `https://${username}:${apiKey}@api.challonge.com/v1/tournaments.json`
  }

  private handleParticipants(responseData: any) {
    //TODO: Complete this
  }

  private handleTournaments(responseData: any) {
    this.tournamentList = responseData.map(function(elem) {
      const td: TournamentData = new TournamentData();
      td.tournamentId = elem.tournament.id;
      td.tournamentName = elem.tournament.name;
      td.tournamentType = elem.tournament.tournament_type;
      td.challongeUrl = elem.tournament.full_challonge_url;
      td.state = elem.tournament.state;
      td.tournamentDate = elem.tournament.created_at;
      return td;
    })
    console.log('tournaments have been handled: returning the following: ' + JSON.stringify(this.tournamentList));
    return this.tournamentList;
  }

  private handleError(error: Response) {
    console.log('error occured in challongCaller: ' + JSON.stringify(error));
  }
}