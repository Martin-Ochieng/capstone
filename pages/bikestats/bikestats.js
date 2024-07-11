// Load environment variables from .env file
require('dotenv').config();


Page({
  data: {
    inputValue: '',
  },
  getData(input) {
    this.setData({
      inputValue: input.detail.value
    });
    console.log(this);
    console.log(this.data.inputValue);
  },
  onLoad() {
    console.log("I have loaded");
  },
  getStats(e) {
    let input = this.data.inputValue;

    if (this.data.inputValue === '') {
      my.alert({
        content: 'Please enter input'
      });
    } else {
      // Fetch External APIs
      const apiURL = 'https://bikeindex.org:443/api/v3/search';
      const params = {
        page: 1,
        per_page: 25,
        location: this.data.inputValue, // Assuming inputValue is the location
        distance: 10,
        stolenness: 'stolen',
        access_token: process.env.ACCESS_TOKEN // Use the access token from .env
      };

      my.request({
        url: apiURL,
        method: 'GET',
        data: params,
        success: function (res) {
          let result, content;
          if (res.status === 200) {
            result = 'Success';
            content = 'Bike Stats for ' + input;

            const bikes = res.data.bikes;

            // Count bikes by manufacturer
            const manufacturerCount = bikes.reduce((acc, bike) => {
              const manufacturer = bike.manufacturer_name || 'Unknown';
              if (!acc[manufacturer]) {
                acc[manufacturer] = 0;
              }
              acc[manufacturer]++;
              return acc;
            }, {});

            // Add manufacturer counts to content
            for (const [manufacturer, count] of Object.entries(manufacturerCount)) {
              
              content += `\n${manufacturer}: ${count} ${count > 1 ? 'bikes' : 'bike'}`;
            }

            console.log(bikes); // Logging bikes if needed for debugging
          } else {
            result = 'Fail';
            content = 'Error sending the request';
          }
          my.alert({
            title: result,
            content: content
          });
        },
        fail: function (res) {
          console.log(`Negative ${res}`);
          my.alert({
            title: 'Fail',
            content: 'Error sending the request'
          });
        },
      });
    }
  },
});
