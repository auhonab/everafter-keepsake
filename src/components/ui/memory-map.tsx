"use client"

import { useState, useEffect, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet'
import { LatLngExpression, Icon, DivIcon } from 'leaflet'
import { MapPin, Heart, Navigation, Loader2, Search, MapIcon, List, Edit, Trash2 } from 'lucide-react'
import { Button } from './button'
import { Input } from './input'
import { Card, CardContent } from './card'
import { useToast } from '@/hooks/use-toast'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'
import 'leaflet/dist/leaflet.css'
import '../../styles/map.css'

// Fix for default markers in react-leaflet
import L from 'leaflet'
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
})

interface Memory {
  _id: string
  title: string
  description?: string
  images: string[]
  date: string
  location?: string
  coordinates?: {
    lat: number
    lng: number
  }
  locationName?: string
  tags?: string[]
}

interface MemoryMapProps {
  memories: Memory[]
  selectedMemory: Memory | null
  onMemorySelect: (memory: Memory | null) => void
  onMemoryUpdate?: (id: string, data: any) => void
  onLocationSelect?: (lat: number, lng: number, name: string) => void
  onMemoryEdit?: (memory: Memory) => void
  onMemoryDelete?: (id: string) => void
}

// Custom heart-shaped marker icon
const createHeartIcon = (isSelected: boolean = false) => {
  return new DivIcon({
    html: `
      <div class="relative flex items-center justify-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="${isSelected ? '#ef4444' : '#dc2626'}" 
             stroke="white" stroke-width="1" class="drop-shadow-lg">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
      </div>
    `,
    className: `custom-heart-marker ${isSelected ? 'selected' : ''}`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  })
}

// Geocoding function using Nominatim (free)
async function geocodeLocation(query: string): Promise<{ lat: number; lng: number; name: string } | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&addressdetails=1`
    )
    const data = await response.json()
    
    if (data.length > 0) {
      const result = data[0]
      return {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        name: result.display_name
      }
    }
    return null
  } catch (error) {
    console.error('Geocoding error:', error)
    return null
  }
}

// Reverse geocoding function
async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
    )
    const data = await response.json()
    return data.display_name || null
  } catch (error) {
    console.error('Reverse geocoding error:', error)
    return null
  }
}

// Component to handle map centering
function MapController({ center, zoom }: { center: LatLngExpression; zoom: number }) {
  const map = useMap()
  
  useEffect(() => {
    map.setView(center, zoom)
  }, [map, center, zoom])
  
  return null
}

// Component to handle click events for adding new memories
function MapClickHandler({ onLocationSelect }: { onLocationSelect?: (lat: number, lng: number, name: string) => void }) {
  const { toast } = useToast()
  
  useMapEvents({
    click: async (e) => {
      if (!onLocationSelect) return
      
      const { lat, lng } = e.latlng
      try {
        const locationName = await reverseGeocode(lat, lng)
        if (locationName) {
          onLocationSelect(lat, lng, locationName)
          toast({
            title: "Location selected",
            description: "You can now create a memory at this location",
          })
        }
      } catch (error) {
        console.error('Error getting location name:', error)
      }
    },
  })
  
  return null
}

// Location input component
function LocationInput({ 
  onLocationSelect, 
  currentLocation 
}: { 
  onLocationSelect: (lat: number, lng: number, name: string) => void
  currentLocation?: { lat: number; lng: number; name: string } | null
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const { toast } = useToast()

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    
    setIsSearching(true)
    try {
      const result = await geocodeLocation(searchQuery)
      if (result) {
        onLocationSelect(result.lat, result.lng, result.name)
        toast({
          title: "Location found",
          description: result.name,
        })
      } else {
        toast({
          title: "Location not found",
          description: "Please try a different search term",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Search error",
        description: "Unable to search for location",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support location services",
        variant: "destructive",
      })
      return
    }

    setIsGettingLocation(true)
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        try {
          const locationName = await reverseGeocode(latitude, longitude)
          if (locationName) {
            onLocationSelect(latitude, longitude, locationName)
            toast({
              title: "Current location found",
              description: locationName,
            })
          }
        } catch (error) {
          toast({
            title: "Error getting location name",
            description: "Location coordinates captured but name unavailable",
            variant: "destructive",
          })
        } finally {
          setIsGettingLocation(false)
        }
      },
      (error) => {
        let message = "Unable to get your location"
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = "Location access denied. Please enable location services."
            break
          case error.POSITION_UNAVAILABLE:
            message = "Location information unavailable"
            break
          case error.TIMEOUT:
            message = "Location request timed out"
            break
        }
        toast({
          title: "Location error",
          description: message,
          variant: "destructive",
        })
        setIsGettingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          placeholder="Search for a location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          className="flex-1"
        />
        <Button
          onClick={handleSearch}
          disabled={isSearching || !searchQuery.trim()}
          size="sm"
        >
          {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        </Button>
      </div>
      
      <Button
        onClick={handleCurrentLocation}
        disabled={isGettingLocation}
        variant="outline"
        size="sm"
        className="w-full"
      >
        {isGettingLocation ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <Navigation className="h-4 w-4 mr-2" />
        )}
        Use Current Location
      </Button>
      
      {currentLocation && (
        <div className="text-sm text-muted-foreground p-2 bg-muted/50 rounded">
          <strong>Selected:</strong> {currentLocation.name}
        </div>
      )}
    </div>
  )
}

// Main memory map component
export default function MemoryMap({
  memories,
  selectedMemory,
  onMemorySelect,
  onMemoryUpdate,
  onLocationSelect,
  onMemoryEdit,
  onMemoryDelete
}: MemoryMapProps) {
  const [mapCenter, setMapCenter] = useState<LatLngExpression>([40.7128, -74.0060]) // Default to NYC
  const [mapZoom, setMapZoom] = useState(10)
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map')
  const [isMapReady, setIsMapReady] = useState(false)
  const { toast } = useToast()

  // Memoize markers to prevent unnecessary re-renders
  const markers = useMemo(() => {
    return memories.filter(memory => memory.coordinates).map(memory => ({
      ...memory,
      position: [memory.coordinates!.lat, memory.coordinates!.lng] as LatLngExpression
    }))
  }, [memories])

  // Center map on user's location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setMapCenter([latitude, longitude])
          setMapZoom(12)
        },
        () => {
          // Fallback to a default location if geolocation fails
          console.log('Geolocation failed, using default center')
        },
        { timeout: 5000 }
      )
    }
  }, [])

  // Focus on selected memory
  useEffect(() => {
    if (selectedMemory?.coordinates) {
      setMapCenter([selectedMemory.coordinates.lat, selectedMemory.coordinates.lng])
      setMapZoom(15)
    }
  }, [selectedMemory])

  const handleLocationSelect = (lat: number, lng: number, name: string) => {
    onLocationSelect?.(lat, lng, name)
  }

  const centerOnUser = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support location services",
        variant: "destructive",
      })
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setMapCenter([latitude, longitude])
        setMapZoom(15)
        toast({
          title: "Centered on your location",
          description: "Map view updated to your current position",
        })
      },
      (error) => {
        toast({
          title: "Location error",
          description: "Unable to get your current location",
          variant: "destructive",
        })
      }
    )
  }

  if (viewMode === 'list') {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Memory Locations</h3>
            <Button
              variant="outline"
              onClick={() => setViewMode('map')}
            >
              <MapIcon className="h-4 w-4 mr-2" />
              Map View
            </Button>
          </div>
          
          <div className="space-y-4">
            {markers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No memories with locations found
              </div>
            ) : (
              markers.map(memory => (
                <Card
                  key={memory._id}
                  className={`cursor-pointer transition-colors ${
                    selectedMemory?._id === memory._id ? 'ring-2 ring-primary' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => onMemorySelect(memory)}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {memory.images[0] && (
                        <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                          <Image
                            src={memory.images[0]}
                            alt={memory.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{memory.title}</h4>
                        <p className="text-sm text-muted-foreground flex items-center mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {memory.locationName || memory.location || 'Unknown location'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(new Date(memory.date))}
                        </p>
                      </div>
                      <div className="flex flex-col gap-1">
                        {onMemoryEdit && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              onMemoryEdit(memory)
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                        )}
                        {onMemoryDelete && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation()
                              onMemoryDelete(memory._id)
                            }}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Controls */}
          <div className="flex flex-wrap gap-2 justify-between items-center">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4 mr-2" />
                List View
              </Button>
              <Button
                variant="outline"
                onClick={centerOnUser}
              >
                <Navigation className="h-4 w-4 mr-2" />
                Center on Me
              </Button>
            </div>
            
            <div className="text-sm text-muted-foreground">
              {markers.length} memories with locations
            </div>
          </div>

          {/* Location Input */}
          <LocationInput
            onLocationSelect={handleLocationSelect}
          />

          {/* Map Container */}
          <div className="h-[500px] w-full rounded-lg overflow-hidden border">
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              className="h-full w-full"
              whenReady={() => setIsMapReady(true)}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              <MapController center={mapCenter} zoom={mapZoom} />
              {onLocationSelect && <MapClickHandler onLocationSelect={onLocationSelect} />}
              
              {/* Memory markers */}
              {markers.map((memory) => (
                <Marker
                  key={memory._id}
                  position={memory.position}
                  icon={createHeartIcon(selectedMemory?._id === memory._id)}
                  eventHandlers={{
                    click: () => onMemorySelect(memory),
                  }}
                >
                  <Popup>
                    <div className="max-w-xs">
                      {memory.images[0] && (
                        <div className="relative w-full h-32 mb-2 rounded overflow-hidden">
                          <Image
                            src={memory.images[0]}
                            alt={memory.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <h4 className="font-semibold text-sm mb-1">{memory.title}</h4>
                      <p className="text-xs text-muted-foreground mb-2">
                        {formatDate(new Date(memory.date))}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center mb-2">
                        <MapPin className="h-3 w-3 mr-1" />
                        {memory.locationName || memory.location}
                      </p>
                      {memory.description && (
                        <p className="text-xs mt-2 line-clamp-2 mb-3">{memory.description}</p>
                      )}
                      
                      {/* Action buttons */}
                      <div className="flex gap-1 mt-2">
                        {onMemoryEdit && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              onMemoryEdit(memory)
                            }}
                            className="flex-1 h-7 text-xs"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                        )}
                        {onMemoryDelete && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              onMemoryDelete(memory._id)
                            }}
                            className="flex-1 h-7 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        )}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* Map status */}
          {!isMapReady && (
            <div className="text-center text-sm text-muted-foreground">
              Loading map...
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
