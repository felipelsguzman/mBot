const payload = {
    object: 'page',
    entry: [
        { id: '170255990084299',
            time: 1474589194299,
            messaging:
                [
                    { sender: {
                        id: '931496313622967'
                    },
                        recipient: {
                            id: '170255990084296'
                        },
                        timestamp: 1474589194257,
                        message:
                        { mid: 'mid.1474589194175:ff914a4bb4cbade393',
                            seq: 436,
                            attachments: [
                                {   title: 'User \'s Location',
                                    url: 'https://www.facebook.com/l.php?u=https%3A%2F%2Fwww.bing.com%2Fmaps%2Fdefault.aspx%3Fv%3D2%26pc%3DFACEBK%26mid%3D8100%26where1%3D-33.431012%252C%2B-70.57618%26FORM%3DFBKPL1%26mkt%3Den-US&h=WAQF5NRW-&s=1&enc=AZMCIWsuNozug1kw6ujrjGUFlnxisdmI8_V7WKBgKNdCZ_0ycBXgtKfI9DgCfFLxDB6HH5Kf32dsZ68-bklicPXIpGRNez9Hq078TQG6YJjvHw',
                                    type: 'location',
                                    payload: {
                                        coordinates: { lat: -33.431012, long: -70.57618 }
                                    }
                                }
                            ]
                        }
                    }
                ]
        }
    ]
};

module.exports = payload;