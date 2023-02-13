/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {LitElement, html, css} from 'lit';
import '../card-api-data/card-api-data'

/**
 * An example element.
 *
 * @fires count-changed - Indicates when the count changes
 * @slot - This element has a slot
 * @csspart button - The button
 */
export class GetApiData extends LitElement {

  static get properties() {
    return {
      /**
       * The name to say "Hello" to.
       * @type {string}
       */
      url: {
        type: String},

      /**
       * The method to the request.
       * @type {string}
       */
      method: {
        type: String
        },

        /**
       * The character's info
       * @type {array}
       */
        characters: {
            type: Array
        },

        page: {
          type: Number
        }
    };
  }

  constructor() {
    super();
    this.url = '';
    this.method = 'GET';
    this.characters = [];
  }

  firstUpdated() {
    this.getData();
  }

  getData() {
    fetch(this.url, {method:this.method})
        .then((response) => {
            if(response.ok) return response.json();
            return response.error
        }) 
        .then((data) =>{ this._sendData(data)})
        .catch((error) => {
            console.warn('La peticion fallo: ', error)
        })
  }

  _sendData(data) {
    
    const customData = [];
    data?.results.forEach(element => {
      customData.push({
        name: element.name, 
        image: element.image,
        status: element.status,
        species: element.species,
        location: element.location
      })
    });

    this.dispatchEvent(new CustomEvent('ApiData', { 
      bubbles:true, 
      detail: {pages:{next: data.info.next, prev: data.info.prev}, data: customData }
    }));
    // console.log('Desde el hijo', data);
  };

  updated(properties) {
    if(properties.has("url")) {
      console.log(properties.get("url"));
      this.getData();
    }
  }

  

  _onClick() {
    this.count++;
    this.dispatchEvent(new CustomEvent('count-changed'));
  }
}

window.customElements.define('get-api-data', GetApiData);
