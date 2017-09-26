# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2017-09-26
### Added
- Basic security layer [view more](https://developers.facebook.com/docs/messenger-platform/webhook#security)
- mBot API
    - mBot.checkMessageSignature()
- CHANGELOG

### Changed
- mBot.koa() have a new mandatory parameter defined as appSecret, this allow you to implement a basic security layer since we're verifying the X-Hub-Signature to  validate the integrity and origin of the payload. [view more](https://developers.facebook.com/docs/messenger-platform/webhook#security) 

## [1.0.0] - 2017-05-28
### Added
- mBot API :
    - mBot.koa()
    - mBot.init()
    - mBot.handlePayload()
    
- mBot Send API: 
    - mBot.api.sendTextMessage()
    - mBot.api.sendAttachment()
    - mBot.api.sendButtonTemplate()
    - mBot.api.sendGenericTemplate()
    - mBot.api.sendListTemplate()
    - mBot.api.sendReceiptTemplate()
    - mBot.api.sendBoardingPassTemplate()
    - mBot.api.sendCheckinTemplate()
    - mBot.api.sendItineraryTemplate()
    - mBot.api.sendFlightUpdateTemplate()
    - mBot.api.sendQuickReplies()
    - mBot.api.sendAction()
    - mBot.api.getUserProfile()
    - mBot.api.setPersistentMenu()
    - mBot.api.setStartButton()
    - mBot.api.setGreeting()
    - mBot.api.readGreeting()
    - mBot.api.readWhitelistedDomains()
    - mBot.api.addWhitelistDomain()
    - mBot.api.deleteWhitelistDomain()