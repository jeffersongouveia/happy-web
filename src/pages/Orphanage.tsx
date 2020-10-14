import React, { useEffect, useState } from 'react'
import { FiClock, FiInfo, FaWhatsapp } from 'react-icons/all'
import { Map, Marker, TileLayer } from 'react-leaflet'
import { useParams } from 'react-router-dom'

import Sidebar from 'components/Sidebar'
import api from 'services/api'
import mapIcon from 'utils/map-icon'
import { IOrphanage } from 'models/orphanage'

import 'styles/pages/orphanage.css'

interface RouteParams {
  id: string
}

const Orphanage: React.FC = () => {
  const params = useParams<RouteParams>()

  const [orphanage, setOrphanage] = useState<IOrphanage>()
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  useEffect(() => {
    api.get<IOrphanage>(`/orphanages/${params.id}`)
      .then(({ data }) => {
        setOrphanage(data)
      })
  }, [params.id])

  return (
    <div id="page-orphanage">
      <Sidebar />

      <main>
        <div className="orphanage-details">
          <img src={orphanage?.images[activeImageIndex].path} alt={orphanage?.name} />

          <div className="images">
            {orphanage?.images.map((image, index) => (
              <button
                key={image.id}
                className={index === activeImageIndex ? 'active' : ''}
                type="button"
                onClick={() => setActiveImageIndex(index)}
              >
                <img src={image.path} alt={orphanage?.name} />
              </button>
            ))}
          </div>

          <div className="orphanage-details-content">
            <h1>{orphanage?.name}</h1>
            <p>{orphanage?.about}</p>

            <div className="map-container">
              <Map
                center={[orphanage?.latitude || 0, orphanage?.longitude || 0]}
                zoom={16}
                style={{ width: '100%', height: 280 }}
                dragging={false}
                touchZoom={false}
                zoomControl={false}
                scrollWheelZoom={false}
                doubleClickZoom={false}
              >
                <TileLayer
                  url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
                />
                <Marker interactive={false} icon={mapIcon} position={[orphanage?.latitude || 0, orphanage?.longitude || 0]} />
              </Map>

              <footer>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${orphanage?.latitude},${orphanage?.longitude}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  Ver rotas no Google Maps
                </a>
              </footer>
            </div>

            <hr />

            <h2>Instruções para visita</h2>
            <p>{orphanage?.instructions}</p>

            <div className="open-details">
              <div className="hour">
                <FiClock size={32} color="#15B6D6" />
                Segunda à Sexta <br />
                {orphanage?.opening_hours}
              </div>

              {orphanage?.open_on_weekends
                ? (
                  <div className="open-on-weekends">
                    <FiInfo size={32} color="#39CC83" />
                    Atendemos <br />
                    fim de semana
                  </div>
                )
                : (
                  <div className="open-on-weekends dont-open">
                    <FiInfo size={32} color="#FF669D" />
                    Não atendemos <br />
                    fim de semana
                  </div>
                )}
            </div>

            <button type="button" className="contact-button">
              <FaWhatsapp size={20} color="#FFF" />
              Entrar em contato
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Orphanage
