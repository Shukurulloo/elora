import ViewModel from "../schema/View.model";

class ViewService {  // tomosha qilishlarni ro'yhatga oladigon mantiq
    private readonly viewModel; // schema modulni chaqiramz

    constructor() {
        this.viewModel = ViewModel;  // ihtiyoriy joylarda ishlatish qulay bo'lishi uhun  tenglab oldik
    }
}

export default ViewService;