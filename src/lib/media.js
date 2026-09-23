// Temporary stock photography, free for commercial use under the Unsplash License.
// Interiors and objects only, no faces, so nobody is mistaken for a Sanisched doctor.
// When real clinic photos exist, swap `src` (and update `alt`, `width`, `height`) here.
import treatmentRoom from "../assets/photos/treatment-room.webp";
import consultationRoom from "../assets/photos/consultation-room.webp";
import reception from "../assets/photos/reception.webp";
import stethoscope from "../assets/photos/stethoscope.webp";

export const PHOTOS = {
  hero: {
    src: treatmentRoom,
    alt: "A bright treatment room with a dental chair beside tall windows",
    width: 1400,
    height: 1247,
    source: "https://images.unsplash.com/photo-1629909615184-74f495363b67",
  },
  about: {
    src: consultationRoom,
    alt: "A quiet examination room with a patient bed and a bench",
    width: 2000,
    height: 860,
    source: "https://images.unsplash.com/photo-1512678080530-7760d81faba6",
  },
  hours: {
    src: reception,
    alt: "The reception counter of a clinic",
    width: 1400,
    height: 851,
    source: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d",
  },
  cta: {
    src: stethoscope,
    alt: "A stethoscope resting on an examination table",
    width: 1400,
    height: 933,
    source: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528",
  },
};
