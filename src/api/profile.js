import api from '@/lib/api'

export function updateProfile(formData) {
  formData.append('_method', 'PATCH')

  return api.post('/profile/update', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export function updatePassword(payload) {
  return api.put('/profile/password', payload)
}
