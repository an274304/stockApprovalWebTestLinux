export class ApiResult<T> {
    message?: string; // Optional property
    result?: boolean; // Optional property
    data?: T;         // Optional property
    dataList?: T[];   // Optional property, array of T
  
    constructor(
      message?: string,
      result?: boolean,
      data?: T,
      dataList?: T[]
    ) {
      this.message = message;
      this.result = result;
      this.data = data;
      this.dataList = dataList;
    }
  }