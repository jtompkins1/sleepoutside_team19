export default class alert {

    constructor() {
        //initialize empty array
        this.alerts = [];
    }

    // Read and parse JSON file
    async loadAlerts() {
        try {
            const response = await fetch('./alerts.json');
            const data = await response.json();
            this.alerts = data;
        } catch (err) {
            console.error('Error reading alerts.json:', err);
        }
    }

    //display alerts
    show() {
        //If alerts are found create a <section class="alert-list> element then  loop through the results
        if (this.alerts.length > 0) {
            const alertList = document.createElement('section');
            alertList.className = 'alert-list';

            this.alerts.forEach(alert => {
                // build a <p> for each alert and apply the background and foreground colors to it specified in the alert.json file
                const p = document.createElement('p');
                p.textContent = alert.message;
                p.style.backgroundColor = alert.backgroundColor;
                p.style.color = alert.foregroundColor;
                alertList.appendChild(p);
            });
        }
    }


}