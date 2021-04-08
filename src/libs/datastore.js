import style from './style.js'
import {format} from '@mapbox/mapbox-gl-style-spec'
import { unset } from 'lodash'

export class DataStore {

  constructor(opts) {
    this.onLocalStyleChange = opts.onLocalStyleChange || (() => {})
    this.onLocalConfigChange = opts.onLocalConfigChange || (() => {})
    const port = opts.port || '8000'
    const host = opts.host || 'localhost'
    this.localUrl = `http://${host}:${port}`
    this.init = this.init.bind(this)
  }

  init(cb) {
    this.latestStyleId = "style"
    this.notifyLocalChanges()
    cb(null)
  }

  notifyLocalChanges() {
    const connection = new EventSource(this.localUrl + '/changes')
    connection.onmessage = e => {
      if(!e.data) return
      let parsedStyle = style.emptyStyle
      try {
        parsedStyle = JSON.parse(e.data)
      } catch(err) {
        console.error(err)
      }
      const updatedStyle = style.ensureStyleValidity(parsedStyle)
      this.onLocalStyleChange(updatedStyle)
    }
  }

  latestStyle(cb) {
    fetch(this.localUrl + '/style.json', {
      mode: 'cors',
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(body) {
      cb(style.ensureStyleValidity(body))
    })
  }

  saveStyle(mapStyle) {
    delete mapStyle.reload;

    const styleJSON = format(
      style.stripAccessTokens(
        style.replaceAccessTokens(mapStyle)
      )
    );

    fetch(this.localUrl + '/style.json', {
      method: "PUT",
      mode: 'cors',
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: styleJSON
    })
    .catch(function(error) {
      if(error) console.error(error)
    })
    return mapStyle
  }

  latestConfig(cb) {
    fetch(this.localUrl + '/config.json', {
      mode: 'cors',
    })
    .then(function(response) {
      return response.json();
    })
    .then(function(body) {
      cb(body)
    })
  }
  
  saveConfig(mapConfig) {
    fetch(this.localUrl + '/config.json', {
      method: "PUT",
      mode: 'cors',
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: mapConfig
    })
    .catch(function(error) {
      if(error) console.error(error)
    })
    return mapConfig
  }
}
