const getIsMobile = () => {
  return (
    window &&
    window.matchMedia &&
    window.matchMedia('(max-width: 40em)').matches
  )
}

export default getIsMobile
