export const maskPhoneNumber = (phone:string) => {
    return phone.replace(/(\(\d{3}\) \d{3}-\d{2})\d{2}/, '$1**');
}