// per-store content that doesn't come from toast: story copy, hours, links.
export const LOCATIONS = {
  "west-valley": {
    id: "west-valley",
    label: "West Valley",
    address: "1980 W 3500 S",
    cityState: "West Valley City, UT 84119",
    fullAddr: "1980 W 3500 S · West Valley City, UT 84119",
    timeCity: "West Valley City, UT",
    phone: "801-887-7272",
    kicker: "Fat Fish — West Valley",
    // google maps directions link. swap for a place_id link if the client wants.
    directions:
      "https://www.google.com/maps/dir/?api=1&destination=Fat%20Fish%2C%201980%20W%203500%20S%2C%20West%20Valley%20City%2C%20UT%2084119",
    story:
      "Where it all began. Our West Valley original has served inventive sushi with a Vietnamese twist since 2013 — fresh, made to order, and the neighborhood's go-to for sushi and pho.",
    hours: [
      { day: "Mon–Thu", time: "11am–3pm, 5pm–9pm" },
      { day: "Fri", time: "11am–3pm, 5pm–10pm" },
      { day: "Sat", time: "3pm–10pm" },
      { day: "Sun", time: "4pm–9pm" },
    ],
    social: [
      { platform: "facebook", href: "https://www.facebook.com/FatFish.WVC/" },
      { platform: "instagram", href: "https://www.instagram.com/fatfishwvc/" },
    ],
    orderLinks: [
      { label: "Order Takeout", href: "https://order.toasttab.com/online/fat-fish-west-valley-sapa-1980-west-3500-south" },
      { label: "Uber Eats", href: "https://www.ubereats.com/store/fat-fish/6hdcTDVMWQmorCFSIGVJtw?diningMode=DELIVERY&ps=1" },
      { label: "DoorDash", href: "https://order.online/store/fat-fish-west-valley-city-157647/?hideModal=true&pickup=true" },
    ],
  },
  bountiful: {
    id: "bountiful",
    label: "Bountiful",
    address: "595 W 2600 S",
    cityState: "Bountiful, UT 84010",
    fullAddr: "595 W 2600 S · Bountiful, UT 84010",
    timeCity: "Bountiful, UT",
    phone: "801-797-5163",
    kicker: "Fat Fish — Bountiful",
    directions:
      "https://www.google.com/maps/dir/?api=1&destination=Fat%20Fish%2C%20595%20W%202600%20S%2C%20Bountiful%2C%20UT%2084010",
    story:
      "Our Bountiful location brings the same inventive sushi and pho north — the day's freshest fish, house specialty rolls, and a warm, modern space made for lingering.",
    hours: [
      { day: "Mon–Thu", time: "11am–3pm, 5pm–9pm" },
      { day: "Fri", time: "11am–3pm, 5pm–10pm" },
      { day: "Sat", time: "3pm–10pm" },
      { day: "Sun", time: "Closed" },
    ],
    note: "Holidays we are closed: 4th of July, Thanksgiving Day, December 24th & 25th.",
    social: [
      { platform: "facebook", href: "https://www.facebook.com/fatfish.bountiful/" },
      { platform: "instagram", href: "https://www.instagram.com/fatfish.bountiful/" },
    ],
    orderLinks: [
      { label: "Order Takeout", href: "https://order.toasttab.com/online/fat-fish-bountiful-sapa-595-west-2600-south" },
      { label: "Uber Eats", href: "https://www.ubereats.com/store/fat-fish-595-w-2600-s/FqCxgH6SXMCotGkCy-mSXg?diningMode=PICKUP" },
      { label: "DoorDash", href: "https://order.online/store/fat-fish-bountiful-604241/?hideModal=true&pickup=true" },
      { label: "Grubhub", href: "https://www.grubhub.com/restaurant/fat-fish--w-2600-s---bountiful-595-w-2600-s-bountiful/3167430" },
    ],
  },
};

export const LOCATION_IDS = Object.keys(LOCATIONS);

// the two photos either side of the story copy. positional names because the
// stores shoot different subjects.
export const STORY_IMAGES = {
  "west-valley": [
    { file: "story-1.jpg", alt: "Mural on the wall at Fat Fish West Valley" },
    { file: "story-2.jpg", alt: "Sake set beside a plate of sushi" },
  ],
  bountiful: [
    { file: "story-1.jpg", alt: "The sushi bar at Fat Fish Bountiful under string lights" },
    { file: "story-2.jpg", alt: "Platter of specialty rolls with a sake set and cherry blossoms" },
  ],
};

export const GALLERY_IMAGES = {
  // gallery photos + alt text per store, keyed by the ids above
  "west-valley": [
    { file: "slide-1.jpg", alt: "Thai iced tea beside a bento box" },
    { file: "slide-2.jpg", alt: "Vietnamese pho with rare beef and fresh herbs" },
    { file: "slide-3.jpg", alt: "Specialty roll topped with caviar and eel sauce" },
    { file: "slide-4.jpg", alt: "Rice noodles with house dipping sauces" },
    { file: "slide-5.jpg", alt: "Fried jalapeno bombs with dipping sauces" },
    { file: "slide-6.jpg", alt: "Close-up of a caviar-topped specialty roll" },
    { file: "slide-7.jpg", alt: "Bento box with Thai iced tea" },
  ],
  bountiful: [
    { file: "slide-1.jpg", alt: "Uni gunkan nigiri plated with microgreens and an edible flower" },
    { file: "slide-2.jpg", alt: "Specialty roll topped with albacore and tuna with chili sauce" },
    { file: "slide-3.jpg", alt: "Specialty roll topped with cilantro, chili sauce, and fried garlic" },
    { file: "slide-4.jpg", alt: "Hand roll plated with microgreens and an edible flower" },
    { file: "slide-5.jpg", alt: "Specialty roll topped with lime, scallions, and soy glaze" },
    { file: "slide-6.jpg", alt: "Cocktail in a copper mug with mint and an edible flower" },
    { file: "slide-7.jpg", alt: "Close-up of a specialty roll topped with seared tuna" },
  ],
};
