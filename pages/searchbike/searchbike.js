// Load environment variables from .env file
require('dotenv').config();

Page({
  data: {
    inputValue: '',
  },
  fetchSerialNumber(input) {
    this.setData({
      inputValue: input.detail.value
    });
    console.log(this);
    console.log("serial number fetched:"+this.data.inputValue);
  },
  onLoad() {
    console.log("search bike loaded");
  },
  callApiToFetchBike(e) {
    let input = this.data.inputValue;

    if (this.data.inputValue === '') {
      my.alert({
        content: 'Please enter the bikes serial number'
      });
    } else {
      // Fetch External APIs
      const apiURL = 'https://bikeindex.org/api/v3/search';
      //const apiURL = 'www.google.com';
      const params = {
        page: 1,
        per_page: 25,
        serial: this.data.inputValue
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
          
          console.log(`Negative ${JSON.stringify(res)}`);
          my.alert({
            title: 'Fail',
            content: 'Error sending the request'
          });
        },
      });
    }
  },
});
