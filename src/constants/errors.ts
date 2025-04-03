export const errorsMessages: Record<number | string, string> = {
  400: 'Bad request. Please check your input and try again.',
  401: 'Unauthorized. Please sign in to continue.',
  403: 'Forbidden. You do not have permission to access this resource.',
  404: 'Not found. The requested resource could not be found.',
  429: 'Too many requests. Please try again later.',
  500: 'Internal server error. Please try again later.',
  502: 'Bad gateway. Please try again later.',
  503: 'Service unavailable. Please try again later.',
  504: 'Gateway timeout. Please try again later.',
  noAssistantModelSelected: 'Please select an assistant model.',
  contentFilteredByChatModel: 'Your message was filtered by the content filter.',
  default: 'An unexpected error occurred. Please try again.',
};

export const getErrorMessage = (status: number | string): string => {
  return errorsMessages[status] || errorsMessages.default;
};
