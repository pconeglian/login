import Slugify from 'slugify'

export const slugify = string => Slugify(string, { replacement: '-', lower: true })
