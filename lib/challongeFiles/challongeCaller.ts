import axios from "axios";

export class ChallongeCaller {

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
      return response.data;
    })
    .catch(ex => this.handleError(ex))
  }

  private handleError(error: Response) {
    console.log('error occured in challongCaller: ' + JSON.stringify(error));
  }
}