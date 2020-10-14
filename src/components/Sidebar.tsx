import React from 'react'
import { FiArrowLeft } from 'react-icons/fi'
import { useHistory } from 'react-router-dom'

import 'styles/pages/sidebar.css'
import mapMarker from 'assets/images/map-marker.svg'

const Sidebar: React.FC = () => {
  const { goBack } = useHistory()

  return (
    <aside className="app-sidebar">
      <img src={mapMarker} alt="Happy" />

      <footer>
        <button type="button" onClick={goBack}>
          <FiArrowLeft size={24} color="#FFF" />
        </button>
      </footer>
    </aside>
  )
}

export default Sidebar
