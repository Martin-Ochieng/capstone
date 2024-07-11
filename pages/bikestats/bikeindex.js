require('dotenv').config();
import { error as _error } from './logger';
import { get } from 'axios';
const bikeApiUrl = 'https://bikeindex.org:443/api/v3/search';
const accessToken = process.env.ACCESS_TOKEN;

async function getStolenBikes(location, distance, page, perPage) {
    try {
        const response = await get(bikeApiUrl, {
            params: {
                page,
                per_page: perPage,
                location,
                distance,
                stolenness: 'stolen',
                access_token: accessToken
            }
        });

        response.data.bikes.forEach(bike => {
            bike.date_stolen = formatUnixTimestamp(bike.date_stolen);
        });


        return response.data.bikes;
    } catch (error) {
        _error(error.message);
        throw new Error(error.message);
    }
}


function formatUnixTimestamp(unixTimestamp) {
    // Convert Unix timestamp to milliseconds
    const milliseconds = unixTimestamp * 1000;
    const date = new Date(milliseconds);

    // Format the date to a readable format
    return date.toUTCString();
}


async function getBikeStats(location, distance, page, perPage) {
    try {
        const response = await get(bikeApiUrl, {
            params: {
                page,
                per_page: perPage,
                location,
                distance,
                stolenness: 'stolen',
                access_token: accessToken
            }
        });

        const bikes = response.data.bikes;
        return bikes.reduce((stats, bike) => {
            const manufacturer = bike.manufacturer_name || 'Unknown';
            stats[manufacturer] = (stats[manufacturer] || 0) + 1;
            return stats;
        }, {});

    } catch (error) {
        _error(error.message);
        throw new Error(error.message);
    }
}

export default {
    getStolenBikes,
    getBikeStats
};
