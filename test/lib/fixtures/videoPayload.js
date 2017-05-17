const payload = {
    object: 'page',
    entry: [
        { id: '170255990084301',
            time: 1474589499045,
            messaging:
                [
                    { sender: {
                        id: '931496313622967'
                    },
                        recipient: {
                            id: '170255990084296'
                        },
                        timestamp: 1474589499005,
                        message:
                        { mid: 'mid.1474589498926:058dabdad12c337623',
                            seq: 438,
                            attachments: [ { type: 'video',
                                payload: { url: 'https://video.xx.fbcdn.net/v/t42.3356-2/14464580_166603067119614_8430419141554339840_n.mp4/video-1474589498.mp4?vabr=495974&oh=bf252c2d459ce76eba53dfa6adf676c1&oe=57E5E63E' } }
                            ]
                        }
                    }
                ]
        }
    ]
};

module.exports = payload;