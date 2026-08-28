// static, location-aware content that isn't toast data — story copy, hours,
// order links. same shape as LOCATION_CONTENT/ORDER_LINKS in the vite site's
// script.js, just collected in one place since react components import it
// directly instead of reading it off a shared module-scope var.
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
    story:
      "Where it all began. Our West Valley original has served inventive sushi with a Vietnamese twist since 2013 — fresh, made to order, and the neighborhood's go-to for sushi and pho.",
    hours: [
      { day: "Mon–Thu", time: "11am–3pm, 5pm–9pm" },
      { day: "Fri", time: "11am–3pm, 5pm–10pm" },
      { day: "Sat", time: "3pm–10pm" },
      { day: "Sun", time: "4pm–9pm" },
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
    story:
      "Our Bountiful location brings the same inventive sushi and pho north — the day's freshest fish, house specialty rolls, and a warm, modern space made for lingering.",
    note: "Holidays we are closed: 4th of July, Thanksgiving Day, December 24th & 25th.",
    orderLinks: [
      { label: "Order Takeout", href: "https://order.toasttab.com/online/fat-fish-bountiful-sapa-595-west-2600-south" },
      { label: "Uber Eats", href: "https://www.ubereats.com/store/fat-fish-595-w-2600-s/FqCxgH6SXMCotGkCy-mSXg?diningMode=PICKUP" },
      { label: "DoorDash", href: "https://order.online/store/fat-fish-bountiful-604241/?hideModal=true&pickup=true" },
    ],
  },
};

export const LOCATION_IDS = Object.keys(LOCATIONS);

export const GALLERY_IMAGES = [
  { file: "slide-1.jpg", alt: "Thai iced tea beside a bento box" },
  { file: "slide-2.jpg", alt: "Vietnamese pho with rare beef and fresh herbs" },
  { file: "slide-3.jpg", alt: "Specialty roll topped with caviar and eel sauce" },
  { file: "slide-4.jpg", alt: "Rice noodles with house dipping sauces" },
  { file: "slide-5.jpg", alt: "Fried jalapeño bombs with dipping sauces" },
  { file: "slide-6.jpg", alt: "Close-up of a caviar-topped specialty roll" },
  { file: "slide-7.jpg", alt: "Bento box with Thai iced tea" },
];
