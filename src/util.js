export function formatIntTime(intTime) {
    // For cases such as last active
    if (intTime === 0)
        return "Never"

    const a = new Date(intTime * 1000)
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const year = a.getFullYear()
    const month = months[a.getMonth()]
    const date = a.getDate()
    const hour = String(a.getHours()).length < 2 ? "0" + String(a.getHours()) : String(a.getHours())
    const min = String(a.getMinutes()).length < 2 ? "0" + String(a.getMinutes()) : String(a.getMinutes())
    const sec = String(a.getSeconds()).length < 2 ? "0" + String(a.getSeconds()) : String(a.getSeconds())
    const time = date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec
    return time
}