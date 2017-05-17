'use strict';

const EventEmitter = require('events');

const messengerApi = {

};

const mBot = Object.setPrototypeOf({
    // Facebook Graph API version
    apiUrl: null,
    // API methods object
    api: messengerApi,
    // verify token for webhook usage
    verifyToken: null,
    // Facebook Page Access Token
    pageToken: null,
    /*
    *
    * Handle payload data
    * @param {array} payload - payload received from facebook messenger
    *
    * */
    handlePayload: async function handlePayload(payload) {
        console.log('GOT: ', payload);
    },
    /*
     * KOA Middleware
     * @param {string} apiVersion - facebook graph api version
     * @param {string} endpoint - endpoint for webhook usage
     * @param {string} verifyToken - verifyToken for webhook usage
     * @param {string} pageToken - facebook page access token
     *
     * */
    koa: function koa({
        apiVersion,
        endpoint,
        verifyToken,
        pageToken
    }) {

        // set api url
        this.apiUrl = 'https://graph.facebook.com/' + apiVersion + '/';

        // set default option for endpoint name
        let url = endpoint === undefined ? '/messenger' : endpoint;

        // check for mandatory access tokens
        let token = ((pToken, vToken)=>{
            if (pToken === undefined ||
                vToken === undefined) {
                throw new Error('you must set valid values for both pageToken and verifyToken params');
            } else {
                // store facebook page access token on main object
                this.pageToken = pToken;
                this.verifyToken = vToken;

                return {
                    page: pToken,
                    verify: vToken
                }
            }
        })(pageToken, verifyToken);

        // return koa middelware
        return async function mBotKoa(ctx, next) {

            if (ctx.path === url && ctx.method === 'GET') {
                //console.log('AKI', this.verifyToken);
                if (ctx.query['hub.verify_token'] === token.verify) {
                    ctx.type = 'text/plain; charset=utf-8';
                    ctx.body = ctx.query['hub.challenge'];
                    ctx.status  = 200;
                } else {
                    ctx.status = 401;
                }
            }

            else if (ctx.path === url && ctx.method === 'POST') {
                if (ctx.request.body.object ==='page') {
                    let payload = ctx.request.body.entry;
                    mBot.handlePayload(payload);
                    ctx.type = 'text/plain; charset=utf-8';
                    ctx.status = 200;
                } else {
                    ctx.status = 400;
                }
            }

            await next();
        }
    }

}, EventEmitter.prototype);

module.exports = mBot;

