export const FONT_SIZES = {
  min: 12,
  max: 200,
  defaultSize: 24
} as const;

export const API_KEYS = {
  FACE_API: '6hqgKUU20GIYTS0RCIk0UYqBekuYfyuAkICgTUb8wBeZI0S0BMgYJQQJ99BAACYeBjFXJ3w3AAAKACOGqD2p',
  COMPUTER_VISION: 'DeX1LbBca5wXNsur24d8RlCtfF0Xk20XoxOmsOavFnwHVw5SEgrjJQQJ99BAACYeBjFXJ3w3AAAFACOG8Dmq'
} as const;

export const API_ENDPOINTS = {
  FACE_API: 'https://yatri-img.cognitiveservices.azure.com',
  COMPUTER_VISION: 'https://wx-cv-imagenity-ai.cognitiveservices.azure.com'
} as const;