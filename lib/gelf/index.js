'use strict'

const _ = require('lodash')

// http://docs.graylog.org/en/2.3/pages/gelf.html
function GelfFactory (logObject, tag) {
  // Libraries SHOULD not allow to send id as additional field (_id).
  if(logObject) {
    delete logObject.id
  }

  // GELF spec string (UTF-8) version - “1.1”; MUST be set by client library.
  // GELF spec string (UTF-8) host - MUST be set by client library.
  const gelfRequiredFields = {
    'version': '1.1',
    'host': logObject.source,
    'level': parseLevel(tag),
    'short_message': setShortMessage(logObject)
  }
  // inserted already above.
  delete logObject.source

  return _.assign(gelfRequiredFields, addUnderscoreToAdditionalFields(logObject))
}

function setShortMessage (logObject) {
  if(!logObject) {
    console.warn('Log object is empty')
    return 'short_message not set'
  }
  if(!logObject.short_message) {
    return 'short_message not set'
  }
  return logObject.short_message
}

function isAdditionalKey (key) {
  switch (key) {
    case 'version':
    case 'host':
    case 'level':
    case 'short_message':
    case 'full_message':
    case 'timestamp':
      return false
      break
    default:
      return true
  }
}

function parseLevel (tag) {
  if (tag !== undefined) tag.toLowerCase()
  let level
  switch (tag) {
    case 'emergency':
      level = 0
      break
    case 'alert':
      level = 1
      break
    case 'critical':
      level = 2
      break
    case 'error':
      level = 3
      break
    case 'warning':
      level = 4
      break
    case 'notice':
      level = 5
      break
    case 'info':
      level = 6
      break
    case 'debug':
      level = 7
      break
    default:
      level = 5
      break
  }
  return level
}

function addUnderscoreToAdditionalFields (logObject) {
  return _.mapKeys(logObject, (value, key) => {
    if(isAdditionalKey(key)) {
      if(key.charAt(0) !== '_') return '_' + key
    } else {
      return key
    }
  })
}

module.exports = {GelfFactory, parseLevel}
