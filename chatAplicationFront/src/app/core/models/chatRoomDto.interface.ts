export interface ChatRoomDto {

    id?: string,
    name: string,
    topic: string,
    adminId: string,
    joinCode?: string,
    chatType: string,
    about: string,
    languages: string,
    participants ?: string[]
}