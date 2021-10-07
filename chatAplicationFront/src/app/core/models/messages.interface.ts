export interface Messages {
    id?: string,
    userId: string,
    messageText: string,
    chatRoomId: string,
    messageTime: any,
    seenMessage: string[],
    userName ?: string,
    profilePhoto ?: string
    // deletedParticipantId ? :string[]
}