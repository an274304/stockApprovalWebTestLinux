export class CountDashboardItems {
    value? : string;
    count? : string;

    constructor(init?: Partial<CountDashboardItems>){
        if(init){
            Object.assign(this, init);
        }
    }
}