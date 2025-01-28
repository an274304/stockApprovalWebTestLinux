import { CountDashboardItems } from "./CountDashboardItems";

export class CountDashboard {
    label? : string;
    value? : string;
    count? : string;
    items? : CountDashboardItems[] = [];

    constructor(init?: Partial<CountDashboard>){
        if(init){
            Object.assign(this, init);
        }
    }
}