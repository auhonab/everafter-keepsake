"use client"

import { useState, useEffect } from 'react'
import { Button } from './button'
import { Input } from './input'
import { Card, CardContent } from './card'
import { Navigation, Loader2, MapPin, X } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface LocationData {
  lat: number
  lng: number
  name: string
}

interface LocationSelectorProps {
  value?: LocationData | null
  onLocationSelect: (location: LocationData | null) => void
  placeholder?: string
  className?: string
}

// Geocoding function using Nominatim (free)
// Exported to avoid unused function warning while keeping it for future use
export async function geocodeLocation(query: string): Promise<LocationData | null> {
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

export default function LocationSelector({
  value,
  onLocationSelect,
  placeholder = "Search for a location...",
  className = ""
}: LocationSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const [suggestions, setSuggestions] = useState<LocationData[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const { toast } = useToast()

  // Debounced search
  useEffect(() => {
    if (searchQuery.length < 3) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    const timeoutId = setTimeout(async () => {
      await searchLocations(searchQuery)
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  const searchLocations = async (query: string) => {
    try {
      setIsSearching(true)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`
      )
      const data = await response.json()
      
      const locations: LocationData[] = data.map((result: { lat: string; lon: string; display_name: string }) => ({
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
        name: result.display_name
      }))
      
      setSuggestions(locations)
      setShowSuggestions(locations.length > 0)
    } catch (error) {
      console.error('Search error:', error)
      setSuggestions([])
      setShowSuggestions(false)
    } finally {
      setIsSearching(false)
    }
  }

  const handleLocationSelect = (location: LocationData) => {
    onLocationSelect(location)
    setSearchQuery('')
    setSuggestions([])
    setShowSuggestions(false)
    toast({
      title: "Location selected",
      description: location.name,
    })
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
            const location: LocationData = {
              lat: latitude,
              lng: longitude,
              name: locationName
            }
            handleLocationSelect(location)
          }
        } catch (_error) {
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

  const clearLocation = () => {
    onLocationSelect(null)
    setSearchQuery('')
    setSuggestions([])
    setShowSuggestions(false)
  }

  return (
    <div className={`relative ${className}`}>
      {/* Current Selection Display */}
      {value && (
        <div className="mb-3 p-3 bg-muted/50 rounded-lg border">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2 flex-1 min-w-0">
              <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">Selected Location</p>
                <p className="text-xs text-muted-foreground break-words">{value.name}</p>
                <p className="text-xs text-muted-foreground font-mono">
                  {value.lat.toFixed(6)}, {value.lng.toFixed(6)}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearLocation}
              className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              placeholder={placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              className="pr-8"
            />
            {isSearching && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>
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
      </div>

      {/* Search Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto">
          <CardContent className="p-0">
            {suggestions.map((location, index) => (
              <button
                key={index}
                onClick={() => handleLocationSelect(location)}
                className="w-full text-left p-3 hover:bg-muted/50 border-b border-border last:border-b-0 transition-colors"
              >
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground break-words">
                      {location.name}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Click outside handler */}
      {showSuggestions && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowSuggestions(false)}
        />
      )}
    </div>
  )
}
