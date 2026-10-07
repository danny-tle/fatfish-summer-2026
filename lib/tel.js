// "801-887-7272" -> "tel:+18018877272"
export function telHref(phone) {
  return "tel:+1" + phone.replace(/\D/g, "");
}
