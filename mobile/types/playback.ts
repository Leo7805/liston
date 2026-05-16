/**
 * Defines types related to playback modes for sentences in the Liston app.
 */

export type PlaybackMode =
  | 'sequential' // Play in original order
  | 'shuffle' // Random order
  | 'least_played' // Prioritize sentences with the lowest play count
  | 'most_played' // Prioritize sentences with the highest play count
  // | 'balanced' // Mix low-playCount sentences with randomness
  | 'high_rating' // Prioritize sentences with higher star ratings
  | 'favorite_first' // Prioritize favorite sentences
  | 'long_first' // Prioritize longer sentences
  | 'short_first'; // Prioritize shorter sentences
