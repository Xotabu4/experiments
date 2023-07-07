import { Chat } from "../components/chat.component";
import { BaseComponent } from "../base.component";

export class DashboardPage extends BaseComponent {
    private logoutButton = (name: string) => this.page.getByRole('button', { name })
    private myButton = 'button.myButton'

    chat = new Chat();
  
    async clickSomeButton() {
      await this.logoutButton('Logout').click();
    }
}
