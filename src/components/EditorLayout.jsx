import React from 'react'
import PropTypes from 'prop-types'
import ScrollContainer from './ScrollContainer'
import { FaPalette, FaDatabase } from 'react-icons/fa';

class AppLayout extends React.Component {
  static propTypes = {
    toolbar: PropTypes.element.isRequired,
    layerList: PropTypes.element.isRequired,
    layerEditor: PropTypes.element,
    map: PropTypes.element.isRequired,
    bottom: PropTypes.element,
    modals: PropTypes.node,
    onModeChange: PropTypes.func,
  }

  static childContextTypes = {
    reactIconBase: PropTypes.object
  }

  getChildContext() {
    return {
      reactIconBase: { size: 14 }
    }
  }

  render() {
    return <div className="maputnik-layout">
      {this.props.toolbar}
      <div className="maputnik-layout-list">
        {this.props.layerList}
      </div>
      <div className="maputnik-layout-drawer">
        <ScrollContainer>
          {this.props.layerEditor}
        </ScrollContainer>
      </div>
      {this.props.map}
      {this.props.bottom && <div className="maputnik-layout-bottom">
          {this.props.bottom}
        </div>
      }
      {this.props.modals}
    </div>
  }
}

export default AppLayout
