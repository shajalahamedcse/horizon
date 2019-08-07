import { apiPath, proxyPrefix } from '../config/api';
import _ from 'lodash';
// return a parsed URL object
const parseURL = (url) => {
    let parser = document.createElement('a');
    parser.href = url;
    return parser;
};

const parseURLPrefix = (data) => {
    let catalog = data.token.catalog;
    let urlPrefix = {};
    catalog.forEach((items) => {
        items.endpoints.forEach((item) => {
            if (item.interface === 'public') {
                urlPrefix[items.type] = parseURL(item.url).pathname
            }
        })
    });
    urlPrefix['monitor'] = '/';
    return urlPrefix;
};
const combineIdentityURL = (operation, tmpl={}) => {
    let serviceType = apiPath[operation].type;
    let url = proxyPrefix[serviceType] +
        apiPath[operation].path;
    return _.template(url)(tmpl);
};


// After Identity Passed.
const combineURL = (operation, tmpl={}) => {
    let serviceType = apiPath[operation].type;
    let urlPrefix = JSON.parse(localStorage.getItem('urlPrefix'));
    let url = proxyPrefix[serviceType] +
        urlPrefix[serviceType] +
        apiPath[operation].path;
    return _.template(url)(tmpl);
};

const getToken = () => {
    return localStorage.getItem('scopedToken');
};

export  {
    parseURLPrefix,
    combineIdentityURL,
    combineURL
}