declare var require: any;

export const environment = {
    production: false,
    version: require('../../package.json').version
};
