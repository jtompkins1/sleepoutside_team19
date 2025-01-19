export default class Alert {

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
                p.style.background= alert.background;
                p.style.color = alert.color;
                alertList.appendChild(p);
            });

            //prepend the alertList section to main
            const mainElement = document.querySelector('main');
            if (mainElement) {
                mainElement.insertBefore(alertList, mainElement.firstChild);
            } else {
                console.error('No <main> element found to prepend alerts to.');
            }
        }
    }

        // Method to initialize and display alerts
        async init() {
            await this.loadAlerts();
            this.show();
        }
    }


