import { TYPE, useToast } from "vue-toastification";

const toast = useToast()

interface NotificationOptions{
    text:string,
    type:TYPE,
    timeout?:number
}

export function notification(options:NotificationOptions){
    toast(options.text ?? "Error unknow",{
        type:options.type,
        timeout:options.timeout ?? 4000
    })
}