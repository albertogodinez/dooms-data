import axios from "axios";
import { TournamentData } from './tournament.data';
import { ParticipantData } from './participant.data';

export class ChallongeCaller {
  tournamentList: TournamentData[];
  participantList: ParticipantData[];
  //TODO: NEED TO OBTAIN JUST THE TOURNAMENTS THAT THEY ARE USING
  //THIS SHOULD HAPPEN WHENEVER THEY ARE GETTING PARTICIPANTS

  //TODO: STORE THESE VALUES IN A SEPERATE FILE
  //where we hold all of the constants
  private api: string;
  private username: string;

  public getTournaments(username: string, apiKey: string, begDate?: Date, endDate?: Date) {
    console.log('getTournaments created_after date+ ' + begDate);
    console.log('getTournaments created_before date+ ' + endDate);
    this.username = username;
    this.api = apiKey;
    let url = `https://${username}:${apiKey}@api.challonge.com/v1/tournaments.json`;
    return axios.get(url, {
      params: {
        created_after: begDate,
        created_before: endDate
      }
    })
    .then(response => {
      //console.log('getTournaments() response from challonge: ' + response.data);
      return this.handleTournaments(response.data);
    })
    .catch(ex => this.handleError(ex))
  }
  
  public getParticipants(tournamentList){
   // console.log('getParticipants() -- calling participant urls: ' + url);
  // console.log('\n\n');
   console.log('current api: ' + this.api);
   console.log('current username: ' + this.username);

    // tournamentList.forEach(tournamentID => {
    //   let url = `https://${this.username}:${this.api}@api.challonge.com/v1/tournaments/${tournamentID}/participants.json`;
    //   console.log('getParticipants() calling challonge -- url: ' + url);
    //   return axios.get(url)
    //   .then(response => {
    //     return this.handleParticipants(response.data);
    //   })
    //   .catch(ex => this.handleError(ex));
    // })

    //let linksArr = ['https://jsonplaceholder.typicode.com/posts', 'https://jsonplaceholder.typicode.com/comments'];

    // return axios.all(tournamentList.map(tournamentID => {
    //   axios.get(`https://${this.username}:${this.api}@api.challonge.com/v1/tournaments/${tournamentID}/participants.json`)
    //   // .then(response => {
    //   //   console.log('0');
    //   //   return this.handleParticipants(response.data);
    //   // })
    //   .catch(ex => this.handleError(ex));
    // }))
    //   .then(axios.spread(function (...res) {
    //     // all requests are now complete
    //     console.log('1');
    //     console.log('getParticipants() response is now ready');
    //     //console.log(res.length);
    //     console.log("current response: " + res);
    //     return this.handleParticipants(res);
    //     //return this.participantList;
    // }))
    // .catch(ex => this.handleError(ex));
    let promises = [];

    for (let i = 0; i < tournamentList.length; i++) {
        promises.push(axios.get(`https://${this.username}:${this.api}@api.challonge.com/v1/tournaments/${tournamentList[i]}/participants.json`));
    }
    return axios.all(promises)
    .then(axios.spread((...args) => {
        for (let i = 0; i < args.length; i++) {
          this.handleParticipants(args[i].data);
            //console.log('current data: ' + JSON.stringify(args[i].data));
        }
    }))
    .then(value => this.participantList);
    // async function test(){
    //   await Promise.all(tournamentList.map(async (tournamentId) => {
    //     let url = `https://${this.username}:${this.api}@api.challonge.com/v1/tournaments/${tournamentID}/participants.json`;
    //     let result = await axios.get(url);
    //     this.handleParticipants(result);
    //     console.log(result);
    //   }));
    //   console.log('after foreach');
    // }

  //.then(response => {return Promise.resolve(this.participantList)});
    //let participantPromise = new Promise
    //return this.participantList;
  }

  private handleParticipants(responseData: any) {
    //console.log('handling participant response: ' + JSON.stringify(responseData));
    var mapped = responseData.map(participant => {
      //console.log('participant: ' + JSON.stringify(participant));
      let pd = new ParticipantData();
      pd.participantId = participant.participant.id;
      pd.gamerTag = participant.participant.name;
      return pd;
    });
    if(!this.participantList || this.participantList.length === 0) {
      this.participantList = mapped;
    } else {
      this.participantList.push(...mapped);
    }
    console.log('CURRENT PARTICIPANT LIST' + JSON.stringify(this.participantList));
    return this.participantList;
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
    //console.log('tournaments have been handled: returning the following: ' + JSON.stringify(this.tournamentList));
    return this.tournamentList;
  }

  private handleError(error: Response) {
    console.log('error occured in challongCaller: ' + error);
  }
}