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
     * Handle incoming data from messenger platform
     * @param {object} payload - data from facebook messenger platform
     *
     * */
    handlePayload: async function handlePayload(payload) {

        let store = {};

        // process entry arrays
        await payload.map(entry => {
            store.id = entry.id;
            store.time = entry.time;

            // process message array
            entry.messaging.map(event => {

                // store shared info
                store.senderId = event.sender.id;
                store.recipientId = event.recipient.id;
                store.timestamp = event.timestamp;

                // check for referral
                if (event.referral) {
                    store.referral = event.referral;
                }

                // check for postback events
                else if (event.postback) {
                    store.postback = event.postback.payload;
                }

                else {
                    store.mid = event.message.mid;
                    store.seq = event.message.seq;

                    // check for quick reply
                    if (event.message.quick_reply) {
                        store.quickReply = event.message.quick_reply;
                    }

                    // check for text message
                    if (event.message.text) {
                        store.text = event.message.text;
                    }

                    // check for attachments
                    else if (event.message.attachments) {

                        let attachment = event.message.attachments[0];

                        // check for sticker
                        if (event.message.sticker_id) {
                            store.stickerId = event.message.sticker_id;
                            store.stickerUrl = attachment.payload.url;
                        }

                        // check for image
                        else if (attachment.type === 'image') {
                            store.image = attachment.payload;
                        }

                        // check for audio
                        else if (attachment.type === 'audio') {
                            store.audio = attachment.payload
                        }

                        // check for video
                        else if (attachment.type === 'video') {
                            store.video = attachment.payload;
                        }

                        // check for location
                        else if (attachment.type === 'location') {
                            store.location = attachment.payload;
                        }

                    }

                }

            });
        });

        // event emitter function based on stored data
        (data => {

            if (data.referral) {
                mBot.emit('referral', data);
            }

            else if (data.postback) {
                mBot.emit('postback', data);
            }

            else if (data.quickReply) {
                mBot.emit('quickReply', data);
            }

            else if (data.text) {
                mBot.emit('text', data);
            }

            else if (data.stickerId) {
                mBot.emit('sticker', data);
            }

            else if (data.image) {
                mBot.emit('image', data);
            }

            else if (data.audio) {
                mBot.emit('audio', data);
            }

            else if (data.video) {
                mBot.emit('video', data);
            }

            else if (data.location) {
                mBot.emit('location', data);
            }

        })(store);
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

