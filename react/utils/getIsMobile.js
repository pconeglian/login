const getIsMobile = () => {
  return window.matchMedia('(max-width: 40em)').matches
}

export default getIsMobile
