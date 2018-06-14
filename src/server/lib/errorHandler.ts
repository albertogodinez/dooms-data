export class ErrorHandler {
  public handleWebServiceError(error: Response) {
    console.log('error occured when service was called: err --- ' + JSON.stringify(error));
  }
}