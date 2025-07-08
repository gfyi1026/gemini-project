export function generatePrompt(template, gallery) {
  return template
    .replace('{mediaUrl}', gallery.media[0])
    .replace('{description}', gallery.metadata.description || '');
}


