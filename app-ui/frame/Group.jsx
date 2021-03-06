/**
 * @author oldj
 * @blog https://oldj.net
 */

'use strict'

import React from 'react'
import { Icon } from 'antd'
import Sortable from 'sortablejs'
import listToArray from 'wheel-js/src/common/listToArray'
import './Group.less'

export default class Group extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      list: [],
      include: []
    }

    this.current_hosts = null
    this.ids = []
  }

  makeItem (item) {
    if (!item) {
      return null
    }

    let attrs = {
      'data-id': item.id || ''
    }

    let icon_type
    if (item.where === 'remote') {
      icon_type = 'global'
    } else if (item.where === 'group') {
      icon_type = 'copy'
    } else {
      icon_type = 'file-text'
    }

    return (
      <div className="hosts-item" {...attrs}>
        <Icon
          type={icon_type}
          className="iconfont"
        />
        <span>{item.title || 'untitled'}</span>
      </div>
    )
  }

  makeList () {
    let include = this.state.include
    let items = this.state.list
      .filter(item => item.where !== 'group' && !include.includes(item.id))
      .map(item => this.makeItem(item))

    return (
      <div id="hosts-group-valid">
        <div ref="group_valid" className="hosts-group-list">
          {items}
        </div>
      </div>
    )
  }

  currentList () {
    let list = this.state.list
    let items = this.state.include
      .map(id => list.find(item => item.id === id))
      .map(item => this.makeItem(item))

    return (
      <div id="hosts-group-current">
        <div ref="group_current" className="hosts-group-list">
          {items}
        </div>
      </div>
    )
  }

  getCurrentListFromDOM () {
    let {updateInclude} = this.props
    let nodes = this.refs.group_current.getElementsByClassName('hosts-item')
    nodes = listToArray(nodes)
    let ids = nodes.map(item => item.getAttribute('data-id'))
    this.ids = ids
    updateInclude(ids)
  }

  componentWillMount () {
    this.setState({
      list: this.props.list,
      include: this.props.include
    })
  }

  componentDidMount () {
    Sortable.create(this.refs.group_valid, {
      group: 'sorting'
      , animation: 150
      , sort: false
    })

    Sortable.create(this.refs.group_current, {
      group: 'sorting'
      , animation: 150
      , sort: true
      , onSort: () => {
        this.getCurrentListFromDOM()
      }
    })
  }

  render () {
    return (
      <div id="hosts-group">
        {this.makeList()}
        <Icon className="arrow" type="arrow-right" />
        {this.currentList()}
      </div>
    )
  }
}
