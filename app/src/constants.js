const apiUrl = process.env.REACT_APP_API_URL;

export const googleMapURL = 'https://maps.googleapis.com/maps/api/js?AIzaSyBU_jAnvZKTJ3s4ewBwimDqMZdh09J8NJ0';

export const api = (path, params, url=apiUrl) => {
    url = new URL(`${url}/${path}`);
    url.search = new URLSearchParams(params).toString();
    return url;
};

export const headers = {
    method: 'GET',
    headers: { 'Content-Type' : 'application/json' },
    mode: 'cors',
    cache: 'default',
}