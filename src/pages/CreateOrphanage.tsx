import React, { ChangeEvent, FormEvent, useCallback, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Map, Marker, TileLayer } from 'react-leaflet'
import { LeafletMouseEvent } from 'leaflet'
import { FiPlus, FiX } from 'react-icons/fi'

import Sidebar from 'components/Sidebar'
import mapIcon from 'utils/map-icon'
import api from 'services/api'

import 'styles/pages/create-orphanage.css'

const CreateOrphanage: React.FC = () => {
  const history = useHistory()

  const [position, setPosition] = useState({ latitude: 0, longitude: 0 })
  const [name, setName] = useState('')
  const [about, setAbout] = useState('')
  const [instructions, setInstructions] = useState('')
  const [openingHours, setOpeningHours] = useState('')
  const [openOnWeekends, setOpenOnWeekends] = useState(true)
  const [images, setImages] = useState<File[]>([])

  // For images preview when uploading
  const [previewImages, setPreviewImages] = useState<string[]>([])

  const handleMapClick = useCallback((event: LeafletMouseEvent) => {
    setPosition({
      latitude: event.latlng.lat,
      longitude: event.latlng.lng,
    })
  }, [])

  const handleSubmit = useCallback(async (event: FormEvent) => {
    event.preventDefault()

    const formData = new FormData()

    formData.append('name', name)
    formData.append('about', about)
    formData.append('instructions', instructions)
    formData.append('opening_hours', openingHours)
    formData.append('open_on_weekends', String(openOnWeekends))
    formData.append('latitude', String(position.latitude))
    formData.append('longitude', String(position.longitude))
    images.forEach((image) => formData.append('images', image))

    await api.post('/orphanages', formData)

    alert('Cadastro realizado com sucesso')
    history.push('/app')
  }, [about, history, images, instructions, name, openOnWeekends, openingHours, position.latitude, position.longitude])

  const handleSelectImages = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return
    }

    const selectedImages = Array.from(event.target.files)
    const selectedImagesPreview = selectedImages.map((image) => URL.createObjectURL(image))

    setImages(selectedImages)
    setPreviewImages(selectedImagesPreview)
  }, [])

  const handleRemoveImage = useCallback((index: number) => {
    const copyPreviewImages = [...previewImages]
    const copyImages = [...images]

    const [removedImage] = copyPreviewImages.splice(index, 1)
    const imageIndex = copyImages.findIndex((i) => URL.createObjectURL(i) === removedImage)
    copyImages.splice(imageIndex, 1)

    setPreviewImages(copyPreviewImages)
    setImages(copyImages)
  }, [images, previewImages])

  return (
    <div id="page-create-orphanage">
      <Sidebar />

      <main>
        <form className="create-orphanage-form" onSubmit={handleSubmit}>
          <fieldset>
            <legend>Dados</legend>

            <Map
              center={[-10.8638136, -61.9696815]}
              style={{ width: '100%', height: 280 }}
              zoom={15}
              onClick={handleMapClick}
            >
              <TileLayer
                url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`}
              />

              {(position.latitude !== 0 && position.longitude !== 0) && (
                <Marker
                  interactive={false}
                  icon={mapIcon}
                  position={[position.latitude, position.longitude]}
                />
              )}
            </Map>

            <div className="input-block">
              <label htmlFor="name">Nome</label>
              <input
                id="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="about">Sobre <span>Máximo de 300 caracteres</span></label>
              <textarea
                id="name"
                maxLength={300}
                value={about}
                onChange={(event) => setAbout(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="images">Fotos</label>

              <div className="images-container">
                {previewImages.map((image, index) => (
                  <div className="image-preview">
                    <img key={image} src={image} alt={name} />

                    <button onClick={() => handleRemoveImage(index)}>
                      <FiX size="25" />
                    </button>
                  </div>
                ))}

                <label htmlFor="input-image" className="new-image">
                  <FiPlus size={24} color="#15b6d6" />
                </label>
              </div>

              <input id="input-image" type="file" multiple onChange={handleSelectImages} />
            </div>
          </fieldset>

          <fieldset>
            <legend>Visitação</legend>

            <div className="input-block">
              <label htmlFor="instructions">Instruções</label>
              <textarea
                id="instructions"
                value={instructions}
                onChange={(event) => setInstructions(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="opening_hours">Horário de funcionamento</label>
              <input
                id="opening_hours"
                value={openingHours}
                onChange={(event) => setOpeningHours(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="open_on_weekends">Atende fim de semana</label>

              <div className="button-select">
                <button
                  type="button"
                  className={openOnWeekends ? 'active' : ''}
                  onClick={() => setOpenOnWeekends(true)}
                >
                  Sim
                </button>

                <button
                  type="button"
                  className={!openOnWeekends ? 'active' : ''}
                  onClick={() => setOpenOnWeekends(false)}
                >
                  Não
                </button>
              </div>
            </div>
          </fieldset>

          <button className="confirm-button" type="submit">
            Confirmar
          </button>
        </form>
      </main>
    </div>
  )
}

export default CreateOrphanage
