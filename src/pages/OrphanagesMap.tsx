import React from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiPlus } from 'react-icons/fi'
import { Map, TileLayer, Marker, Popup } from 'react-leaflet'
import Leaflet from 'leaflet'

import 'styles/pages/orphanages-map.css'
import mapMarking from 'assets/images/map-marker.svg'

const mapIcon = Leaflet.icon({
  iconUrl: mapMarking,
  iconSize: [58, 68],
  iconAnchor: [29, 68],
  popupAnchor: [170, 2],
})

const OrphanagesMap: React.FC = () => {
  const tileURL = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`

  return (
    <div id="page-map">
      <aside>
        <header>
          <img src={mapMarking} alt="Happy" />

          <h2>
            Escolha um orfanato no mapa
          </h2>
          <p>
            Muitas crianças estão esperando a sua visita :)
          </p>
        </header>

        <footer>
          <strong>Ji-Paraná</strong>
          <span>Rondônia</span>
        </footer>
      </aside>

      <Map
        center={[-10.8638136, -61.9696815]}
        zoom={15}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer url={tileURL} />

        <Marker position={[-10.8529306, -61.9717976]} icon={mapIcon}>
          <Popup
            closeButton={false}
            minWidth={240}
            maxWidth={240}
            className="map-popup"
          >
            Mansão Foster para Amigos Imaginários

            <Link to="/orphanages/1">
              <FiArrowRight size={20} color="#FFF" />
            </Link>
          </Popup>
        </Marker>
      </Map>

      <Link to="/orphanages/create" className="create-orphanage">
        <FiPlus size={32} color="#FFF" />
      </Link>
    </div>
  )
}

export default OrphanagesMap
