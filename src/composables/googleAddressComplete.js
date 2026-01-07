import { ref } from 'vue'
import { fetchAddressSuggestions, fetchPlaceDetails } from '@/api/addressLookup'
import debounce from 'lodash.debounce'

export default function useGoogleAddressAutocomplete(countries = []) {
  const query = ref('')
  const suggestions = ref([])
  const selectedAddress = ref(null)

  const fetchSuggestions = debounce(async () => {
    if (!countries.value?.length) return
    if (query.value.length < 3) return
    if (selectedAddress.value) return

    try {
      const { data } = await fetchAddressSuggestions(
        query.value,
        countries.value.map((c) => c.iso_2_name),
      )

      suggestions.value = data.predictions ?? []
    } catch (error) {
      console.error('Error fetching suggestions:', error)
    }
  }, 400)

  const getPlaceDetails = async (placeId) => {
    try {
      const { data: details } = await fetchPlaceDetails(placeId)

      const address = {
        street: '',
        number: '',
        postalCode: '',
        city: '',
        country: '',
        country_id: null,
        region: '',
        latitude: details.location?.latitude,
        longitude: details.location?.longitude,
      }

      for (const comp of details.addressComponents) {
        const type = comp.types[0]

        switch (type) {
          case 'street_number':
            address.number = comp.longText
            break
          case 'route':
            address.street = comp.longText
            break
          case 'postal_code':
            address.postalCode = comp.longText
            break
          case 'locality':
            address.city = comp.longText
            break
          case 'administrative_area_level_1':
            address.region = comp.longText
            break
          case 'country':
            address.country = comp.longText

            const match = countries.value.find(
              (c) =>
                c.name.toLowerCase() === comp.longText.toLowerCase() ||
                c.iso_code?.toLowerCase() === comp.shortText?.toLowerCase(),
            )

            address.country_id = match?.id ?? null
            break
        }
      }

      selectedAddress.value = address
      return address
    } catch (error) {
      console.error('Error fetching place details:', error)
    }
  }

  const selectAddress = async (suggestion) => {
    query.value = suggestion.description
    suggestions.value = []
    return await getPlaceDetails(suggestion.place_id)
  }

  return {
    query,
    suggestions,
    selectedAddress,
    fetchSuggestions,
    selectAddress,
  }
}
