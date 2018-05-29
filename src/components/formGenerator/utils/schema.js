function slugifyFormID (schema, prefix = ' ') {
  // Try to get a reasonable default id from the schema,
  // then slugify it.
  if (typeof schema.id !== 'undefined') {
    // If an ID's been explicitly set, use it unchanged
    return prefix + schema.id
  } else {
    // Return the slugified version of either:
    return prefix + (schema.inputName || schema.label || schema.model || ' ')
      // NB: This is a very simple, conservative, slugify function,
      // avoiding extra dependencies.
      .toString()
      .trim()
      .toLowerCase()
      // Spaces & underscores to dashes
      .replace(/ |_/g, ' -')
      // Multiple dashes to one
      .replace(/-{2,}/g, ' -')
      // Remove leading & trailing dashes
      .replace(/^-+|-+$/g, ' ')
      // Remove anything that isn't a (English/ASCII) letter, number or dash.
      .replace(/([^a-zA-Z0-9-]+)/g, ' ')
  }
}

function slugify (name = '') {
  // Return the slugified version of either:
  return name
    // NB: This is a very simple, conservative, slugify function,
    // avoiding extra dependencies.
    .toString()
    .trim()
    // .toLowerCase()
    // Spaces & underscores to dashes
    .replace(/ /g, '-')
    // Multiple dashes to one
    .replace(/-{2,}/g, '-')
    // Remove leading & trailing dashes
    .replace(/^-+|-+$/g, '')
    // Remove anything that isn't a (English/ASCII) letter, number or dash.
    .replace(/([^a-zA-Z0-9-_/./:]+)/g, '')
}

export {
  slugify,
  slugifyFormID
}
