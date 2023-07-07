import { Page } from "@playwright/test";
import { DashboardPage } from "./dashboard/dashboard.page";


export class Application {
    dashboard = new DashboardPage(this.page);
    call = new CallPage(this.page);

    constructor(private page: Page) {

    }
}
