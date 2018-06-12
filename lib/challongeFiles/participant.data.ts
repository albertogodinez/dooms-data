export class ParticipantData {
  participantId: number;
  gamertag: string;
  totalNumTournaments: number = 0;
  firstAttendedDate: Date;
  lastAttendedDate: Date;
  active: Boolean;
  totalNumWins: number = 0;
  totalNumLosses: number = 0;
  totalNumSets: number = 0;;
  listOfWins: string[] = [];
  listOfLosses: string[] = [];
  listOfTournamentUrls: string[] = [];
}
