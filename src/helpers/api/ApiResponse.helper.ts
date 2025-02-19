export default class ApiResponseHelper<T> {
  public success: boolean;
  public statusCode: number;
  public message: string;
  public errors: null;
  public result: IData<T>;
  constructor(statusCode = 200, message = "Success", data: T) {
    this.success = true;
    this.statusCode = statusCode;
    this.message = message;
    this.errors = null;
    this.result = {
      timestamp: Date.now(),
      data
    };
  }
}

interface IData<T> {
  timestamp: number;
  [key: string]: any;
  data: T;
}
