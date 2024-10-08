export default function(timeStamp, isPrecisionMode = false) {
  const date = new Date(+timeStamp)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date
    .getDate()
    .toString()
    .padStart(2, '0')
  const hours = date
    .getHours()
    .toString()
    .padStart(2, '0')
  const minutes = date
    .getMinutes()
    .toString()
    .padStart(2, '0')
  const seconds = date
    .getSeconds()
    .toString()
    .padStart(2, '0')
  const weekArray = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  const week = weekArray[date.getDay()]
  if (isPrecisionMode) return `${date.getFullYear()}-${month}-${day} \u202F ${hours}:${minutes}:${seconds} \u202F ${week}`
  return `${date.getFullYear()}-${month}-${day}`
}
